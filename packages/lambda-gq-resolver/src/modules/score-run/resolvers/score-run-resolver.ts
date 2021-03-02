/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg } from 'type-graphql';
import _ from 'lodash';
import Heat from 'src/domain/models/heat';
import { ScorRunInput } from 'src/modules/score-run/inputs/score-run-inputs';
import { mapper } from 'src/utils/mapper';
import RiderAllocation from 'src/domain/models/rider-allocation';
import errorMessage from 'src/config/error-message';

@Resolver()
export default class ScoreRun {
    @Mutation(() => Heat)
    // @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async scoreRun(@Arg('input', () => ScorRunInput) input: ScorRunInput): Promise<Heat> {
        const heat = await mapper.get(Object.assign(new Heat(), { id: input.allocatableId }));

        const seedSlots = await heat.getSeedSlots();
        const orderedSeedSlots = _.orderBy(seedSlots, (seedSlot) => seedSlot.seed, 'asc');

        const selectedSeedSlot = _.find(orderedSeedSlots, { userId: input.userId });

        if (!selectedSeedSlot) {
            throw new Error(errorMessage.canNotFindSeedSlot);
        }

        const riderAllocationsLookup: { [key in string]: RiderAllocation } = {};

        const getFns = orderedSeedSlots.map((seedSlot) => async () => {
            riderAllocationsLookup[seedSlot.id] = await seedSlot.getRiderAllocation();
        });
        await Promise.all(getFns.map((fn) => fn()));

        riderAllocationsLookup[selectedSeedSlot.id].runs = input.runs;

        const newSeedSlotOrder = _.orderBy(
            orderedSeedSlots,
            [(seedSlot) => riderAllocationsLookup[seedSlot.id].getBestScore(), (seedSlot) => riderAllocationsLookup[seedSlot.id].startSeed],
            ['desc', 'asc']
        );

        // console.log('newSeedSlotOrder', newSeedSlotOrder);

        const updatedSeedSlots = orderedSeedSlots.map((seedSlot, i) => {
            // seedSlot = Object.assign(new SeedSlot(), { ...seedSlot, userId: newSeedSlotOrder[i].userId });
            seedSlot = _.cloneDeep(seedSlot);
            seedSlot.userId = newSeedSlotOrder[i].userId;
            return seedSlot;
        });

        const selectedRiderAllocation = riderAllocationsLookup[selectedSeedSlot.id];

        await mapper.update(selectedRiderAllocation, { onMissing: 'skip' });

        const updateSeedSlotFns = updatedSeedSlots.map((seedSlot) => async () => mapper.update(seedSlot, { onMissing: 'skip' }));
        await Promise.all(updateSeedSlotFns.map((fn) => fn()));

        return heat;
    }
}