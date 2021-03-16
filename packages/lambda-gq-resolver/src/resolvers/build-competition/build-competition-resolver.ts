/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';
import _ from 'lodash';
import Round from 'src/domain/models/round';
import Heat, { SeedSlot } from 'src/domain/models/heat';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import Competition from 'src/domain/models/competition';
import isCompetitionAdmin from 'src/middleware/auth-check/is-comp-admin';
import { CompetitionParamsInput } from 'src/resolvers/build-competition/inputs';
import BatchWriteRequest from 'src/utils/dynamo-easy/batch-write-request';
import { BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';
import { valueIsNull } from 'src/utils/utility';

@Resolver()
export default class BuildCompetition {
    @Mutation(() => Competition, { nullable: true })
    @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async buildCompetition(@Arg('id', () => ID) id: string, @Arg('params', () => CompetitionParamsInput) params: CompetitionParamsInput): Promise<Competition> {
        const start = new Date().getTime();

        const competition = await Competition.store.get(id).exec();

        const prevCompDescendants = await competition.getDescendants();

        params.rounds = _.orderBy(params.rounds, ['roundNo', 'type'], ['asc', 'asc']);

        const roundsToCreate: Round[] = [];
        const heatsToCreate: Heat[] = [];
        const allSeedSlots: SeedSlot[] = [];

        // Maps created seedslots back to their parent heats
        const heatMap: Map<SeedSlot, Heat> = new Map();

        params.rounds.forEach((roundParam) => {
            const { heats: heatParams, ...roundInput } = roundParam;
            const round = Object.assign(new Round(), roundInput);
            roundsToCreate.push(round);
            heatParams.forEach((heatParam) => {
                const { seedSlots: seedSlotParams, ...heatInput } = heatParam;
                const heat = Object.assign(new Heat(), heatInput);
                heatsToCreate.push(heat);
                seedSlotParams.forEach((seedSlotParam) => {
                    const seedSlot = new SeedSlot();
                    seedSlot.seed = seedSlotParam.seed;
                    heat.seedSlots.push(seedSlot);
                    heatMap.set(seedSlot, heat);
                    allSeedSlots.push(seedSlot);
                });
                heat.roundId = round.id;
            });
            round.competitionId = competition.id;
        });

        const seedsHolder: { [key in string]: SeedSlot } = {};

        allSeedSlots.reverse().forEach((seedSlot) => {
            // If I have seen this seed already
            if (seedsHolder[seedSlot.seed]) {
                if (valueIsNull(seedSlot.nextHeatId)) {
                    seedSlot.nextHeatId = heatMap.get(seedsHolder[seedSlot.seed]).id; // Set that one as my parent
                } else {
                    seedSlot.nextHeatId = undefined;
                }
            } else {
                seedSlot.nextHeatId = undefined;
            }
            seedsHolder[seedSlot.seed] = seedSlot; // Now keep track of this one
        });

        await Promise.all([
            ...new BatchWriteRequest().deleteChunks(_.chunk(prevCompDescendants, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec()),
            ...new BatchWriteRequest().putChunks(_.chunk([...heatsToCreate, ...roundsToCreate], BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec()),
        ]);

        const end = new Date().getTime();

        console.log(`took ${end - start}`);

        return competition;
    }
}
