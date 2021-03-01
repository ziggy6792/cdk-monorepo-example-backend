import { equals } from '@aws/dynamodb-expressions';
/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import Competition from 'src/domain/models/competition';
import SeedSlot from 'src/domain/models/seed-slot';
import isCompetitionAdmin from 'src/middleware/auth-check/is-comp-admin';
import { mapper } from 'src/utils/mapper';
import errorMessage from 'src/config/error-message';
import _ from 'lodash';
import RiderAllocation from 'src/domain/models/rider-allocation';
import { toArray } from 'src/utils/async-iterator';

const defaultRiderAllocation = { runs: [{ score: null }, { score: null }] };

@Resolver()
export default class AllocateRiders {
    @Mutation(() => Competition, { nullable: true })
    @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async allocateRiders(@Arg('id', () => ID) id: string): Promise<Competition> {
        // console.log(`Allocate riders for competition ${id}`);

        const competition = await mapper.get(Object.assign(new Competition(), { id }));
        const rounds = await competition.getRounds({
            subject: 'roundNo',
            ...equals(1),
        });
        console.log('rounds', JSON.stringify(rounds));
        if (rounds.length !== 1) {
            throw new Error(errorMessage.canNotFindRound1);
        }
        const round1 = rounds[0];
        const round1Heats = await round1.getHeats();
        const getSeedSlotFns = round1Heats.map((heat) => async () => heat.getSeedSlots());
        const round1SeedSlots = _.flatten(await Promise.all(getSeedSlotFns.map((fn) => fn())));

        const seedSlotsLookup: { [key in number]: SeedSlot } = {};
        round1SeedSlots.forEach((seedSlot) => {
            seedSlotsLookup[seedSlot.seed] = seedSlot;
        });

        const riderAllocations = await competition.getRiderAllocations();

        const riderAllocationsLookup: { [key in number]: string } = {};
        riderAllocations.forEach(({ startSeed, userId }) => {
            riderAllocationsLookup[startSeed] = userId;
        });

        const updateSeedSlots: SeedSlot[] = [];
        const createRiderAllocations: RiderAllocation[] = [];

        ((Object.keys(seedSlotsLookup) as unknown) as number[]).forEach((seed) => {
            if (riderAllocationsLookup[seed] && seedSlotsLookup[seed]) {
                updateSeedSlots.push(Object.assign(new SeedSlot(), { id: seedSlotsLookup[seed].id, userId: riderAllocationsLookup[seed] }));
                createRiderAllocations.push(
                    Object.assign(new RiderAllocation(), {
                        ...defaultRiderAllocation,
                        allocatableId: seedSlotsLookup[seed].heatId,
                        userId: riderAllocationsLookup[seed],
                        startSeed: seed,
                    })
                );
            }
        });

        const updateSeedSlotFns = updateSeedSlots.map((seedSlot) => async () => mapper.update(seedSlot, { onMissing: 'skip' }));
        // Update seed slots
        await Promise.all(updateSeedSlotFns.map((fn) => fn()));
        // Create rider allocations
        await toArray(mapper.batchPut(createRiderAllocations));

        return competition;
    }
}
