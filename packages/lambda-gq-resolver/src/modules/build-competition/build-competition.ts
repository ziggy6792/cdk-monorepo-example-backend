/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, ID } from 'type-graphql';
import { IContext } from 'src/types';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import isAuthRole from 'src/middleware/is-auth-role';
import CompetitionModel from 'src/domain/models/competition';
import _ from 'lodash';
import SeedSlot from 'src/domain/models/seed-slot';
import Round from 'src/domain/models/round';
import Heat from 'src/domain/models/heat';
import { v4 as uuidv4 } from 'uuid';
import { VALUE, valueIsNull } from 'src/utils/utility';
import { toArray } from 'src/utils/async-iterator';
import Creatable from 'src/domain/models/abstract/creatable';
import { CompetitionParamsInput } from './inputs';

@Resolver()
export default class BuildCompetition {
    @Mutation(() => CompetitionModel, { nullable: true })
    // @UseMiddleware(isAuthUser)
    async buildCompetition(
        @Ctx() ctx: IContext,
        @Arg('id', () => ID) id: string,
        @Arg('params', () => CompetitionParamsInput) params: CompetitionParamsInput
    ): Promise<CompetitionModel> {
        const competition = await mapper.get(Object.assign(new CompetitionModel(), { id }));

        const rounds = await competition.getRounds();

        mapper.batchDelete(rounds);

        params.rounds = _.orderBy(params.rounds, ['roundNo', 'type'], ['asc', 'asc']);

        const roundsToCreate: Round[] = [];
        const heatsToCreate: Heat[] = [];
        const seedSlotsToCreate: SeedSlot[] = [];

        params.rounds.forEach((roundParam) => {
            const { heats: heatParams, ...roundInput } = roundParam;
            const round = Object.assign(new Round(), roundInput);
            round.setDefaults();
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

        console.log('Running buildCompetition resolver');
        console.log(id);
        console.log(JSON.stringify(params));
        console.log(params.rounds[0].heats[0].seedSlots[0].seed);

        // await toArray(mapper.batchPut(seedSlotsToCreate));
        // await toArray(mapper.batchPut(heatsToCreate));
        // await toArray(mapper.batchPut(roundsToCreate));

        const start = new Date().getTime();

        // let orderedPutOperations = [];

        // const generatePutOperations = (items: Creatable[]) => items.map((item) => async () => mapper.put(item));

        // heatsToCreate.forEach((heat) => {
        //     console.log(heat.name);
        // });

        // orderedPutOperations = _.concat(orderedPutOperations, generatePutOperations(seedSlotsToCreate));
        // orderedPutOperations = _.concat(orderedPutOperations, generatePutOperations(heatsToCreate));
        // orderedPutOperations = _.concat(orderedPutOperations, generatePutOperations(roundsToCreate));

        // for (let i = 0; i < orderedPutOperations.length; i++) {
        //     // eslint-disable-next-line no-await-in-loop
        //     // await orderedPutOperations[i]();
        // }

        await Promise.all([toArray(mapper.batchPut(seedSlotsToCreate)), toArray(mapper.batchPut(heatsToCreate)), toArray(mapper.batchPut(roundsToCreate))]);

        const end = new Date().getTime();

        console.log(`took ${end - start}`);

        return competition;
    }
}
