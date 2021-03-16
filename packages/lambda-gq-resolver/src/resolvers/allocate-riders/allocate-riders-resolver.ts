/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import Competition from 'src/domain/models/competition';
import isCompetitionAdmin from 'src/middleware/auth-check/is-comp-admin';
import errorMessage from 'src/config/error-message';
import _ from 'lodash';
import RiderAllocation from 'src/domain/models/rider-allocation';
import { attribute, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';
import BatchWriteRequest from 'src/utils/dynamo-easy/batch-write-request';

@Resolver()
export default class AllocateRiders {
    @Mutation(() => Competition, { nullable: true })
    @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async allocateRiders(@Arg('id', () => ID) id: string): Promise<Competition> {
        const competition = await Competition.store.get(id).exec();
        const rounds = await competition.getRounds([attribute('roundNo').equals(1)]);
        if (rounds.length !== 1) {
            throw new Error(errorMessage.canNotFindRound1);
        }
        const round1 = rounds[0];
        const round1Heats = await round1.getHeats();

        // Map from each seed number to the round 1 heat it belongs to
        const seedHeatLookup: Map<number, string> = new Map();

        round1Heats.forEach((heat) => {
            heat.seedSlots.forEach((seedSlot) => {
                seedHeatLookup.set(seedSlot.seed, heat.id);
            });
        });

        const riderAllocations = await competition.getRiderAllocations();

        const riderAllocationsLookup: Map<number, string> = new Map();
        riderAllocations.forEach(({ startSeed, userId }) => {
            riderAllocationsLookup.set(startSeed, userId);
        });

        const createRiderAllocations: RiderAllocation[] = [];

        for (const seed of seedHeatLookup.keys()) {
            if (riderAllocationsLookup.get(seed) && seedHeatLookup.get(seed)) {
                const riderAllocation = new RiderAllocation();
                riderAllocation.allocatableId = seedHeatLookup.get(seed);
                riderAllocation.userId = riderAllocationsLookup.get(seed);
                riderAllocation.startSeed = seed;
                riderAllocation.initRuns();
                createRiderAllocations.push(riderAllocation);
            }
        }

        // await Promise.all(
        //     RiderAllocation.store
        //         .myBatchWrite()
        //         .putChunks(_.chunk(createRiderAllocations, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT))
        //         .map((req) => req.exec())
        // );

        await Promise.all(new BatchWriteRequest().putChunks(_.chunk(createRiderAllocations, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec()));

        return competition;
    }
}
