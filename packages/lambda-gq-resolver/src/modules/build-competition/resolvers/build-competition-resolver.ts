/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';
import _ from 'lodash';
import SeedSlot from 'src/domain/models/seed-slot';
import Round from 'src/domain/models/round';
import Heat from 'src/domain/models/heat';
import { valueIsNull } from 'src/utils/utility';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import Competition from 'src/domain/models/competition';
import isCompetitionAdmin from 'src/middleware/auth-check/is-comp-admin';
import { CompetitionParamsInput } from 'src/modules/build-competition/inputs';
import BatchWriteRequest from 'src/utils/dynamo-easy/batch-write-request';

@Resolver()
export default class BuildCompetition {
    @Mutation(() => Competition, { nullable: true })
    @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async buildCompetition(@Arg('id', () => ID) id: string, @Arg('params', () => CompetitionParamsInput) params: CompetitionParamsInput): Promise<Competition> {
        const start = new Date().getTime();

        // const competition = await mapper.get(Object.assign(new Competition(), { id }));
        const competition = await Competition.store.get(id).exec();

        const prevCompDescendants = await competition.getDescendants();

        params.rounds = _.orderBy(params.rounds, ['roundNo', 'type'], ['asc', 'asc']);

        const roundsToCreate: Round[] = [];
        const heatsToCreate: Heat[] = [];
        const seedSlotsToCreate: SeedSlot[] = [];

        params.rounds.forEach((roundParam) => {
            const { heats: heatParams, ...roundInput } = roundParam;
            const round = Object.assign(new Round(), roundInput);
            round.setDefaults();
            console.log('round', round);
            roundsToCreate.push(round);
            heatParams.forEach((heatParam) => {
                const { seedSlots: seedSlotParams, ...heatInput } = heatParam;
                const heat = Object.assign(new Heat(), heatInput);
                heat.setDefaults();
                heatsToCreate.push(heat);
                seedSlotParams.forEach((seedSlotParam) => {
                    const seedSlot = Object.assign(new SeedSlot(), seedSlotParam);
                    seedSlot.setDefaults();
                    seedSlotsToCreate.push(seedSlot);
                    seedSlot.heatId = heat.id;
                });
                heat.roundId = round.id;
            });
            round.competitionId = competition.id;

            // competition.addScheduleItem(new ScheduleItem({ schedulableId: round.id }));
        });

        const seedsHolder = {};

        seedSlotsToCreate.reverse().forEach((seedSlot) => {
            // If I have seen this seed already
            if (seedsHolder[seedSlot.seed]) {
                if (valueIsNull(seedSlot.parentSeedSlotId)) {
                    seedSlot.parentSeedSlotId = seedsHolder[seedSlot.seed].id; // Set that one as my parent
                } else {
                    seedSlot.parentSeedSlotId = undefined;
                }
            } else {
                seedSlot.parentSeedSlotId = undefined;
            }
            seedsHolder[seedSlot.seed] = seedSlot; // Now keep track of this one
        });

        // ToDo delete old

        // await Promise.all([
        //     toArray(mapper.batchDelete(prevCompDescendants)),
        //     toArray(mapper.batchPut(seedSlotsToCreate)),
        //     toArray(mapper.batchPut(heatsToCreate)),
        //     toArray(mapper.batchPut(roundsToCreate)),
        // ]);

        await Promise.all([
            ...new BatchWriteRequest().deleteChunks(_.chunk(prevCompDescendants, 25)).map((req) => req.exec()),
            ...new BatchWriteRequest().putChunks(_.chunk([...seedSlotsToCreate, ...heatsToCreate, ...roundsToCreate], 25)).map((req) => req.exec()),
        ]);

        const end = new Date().getTime();

        console.log(`took ${end - start}`);

        return competition;
    }
}
