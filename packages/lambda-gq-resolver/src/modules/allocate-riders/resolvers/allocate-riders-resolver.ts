/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import Competition from 'src/domain/models/competition';
import isCompetitionAdmin from 'src/middleware/auth-check/is-comp-admin';
import errorMessage from 'src/config/error-message';
import _ from 'lodash';
import RiderAllocation from 'src/domain/models/rider-allocation';
import { attribute, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';
import { SeedSlot } from 'src/domain/models/heat';

const defaultRiderAllocation = { runs: [{ score: null }, { score: null }] };

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
        const seedHeatLookup: { [key in number]: string } = {};

        round1Heats.forEach((heat) => {
            heat.seedSlots.forEach((seedSlot) => {
                seedHeatLookup[seedSlot.seed] = heat.id;
            });
        });

        const riderAllocations = await competition.getRiderAllocations();

        const riderAllocationsLookup: { [key in number]: string } = {};
        riderAllocations.forEach(({ startSeed, userId }) => {
            riderAllocationsLookup[startSeed] = userId;
        });

        const createRiderAllocations: RiderAllocation[] = [];

        console.log('seedHeatLookup', seedHeatLookup);
        console.log('riderAllocations', riderAllocations);

        ((Object.keys(seedHeatLookup) as unknown) as number[]).forEach((seed) => {
            if (riderAllocationsLookup[seed] && seedHeatLookup[seed]) {
                createRiderAllocations.push(
                    Object.assign(new RiderAllocation(), {
                        ...defaultRiderAllocation,
                        allocatableId: seedHeatLookup[seed],
                        userId: riderAllocationsLookup[seed],
                        startSeed: seed,
                    })
                );
            }
        });

        console.log('createRiderAllocations', createRiderAllocations);

        // const updateSeedSlotFns = updateSeedSlots.map((seedSlot) => SeedSlot.store.updateItem(seedSlot));
        // Update seed slots
        // await Promise.all(updateSeedSlotFns.map((req) => req.exec()));
        // Create rider allocations
        await Promise.all(
            RiderAllocation.store
                .myBatchWrite()
                .putChunks(_.chunk(createRiderAllocations, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT))
                .map((req) => req.exec())
        );

        return competition;
    }
}
