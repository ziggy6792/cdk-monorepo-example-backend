/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg } from 'type-graphql';
import Competition from 'src/domain/models/competition';
import _ from 'lodash';
import Heat from 'src/domain/models/heat';
import { ScorRunInput } from 'src/modules/score-run/inputs/score-run-inputs';
import { mapper } from 'src/utils/mapper';
import RiderAllocation from 'src/domain/models/rider-allocation';

@Resolver()
export default class ScoreRun {
    @Mutation(() => Heat, { nullable: true })
    // @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async scoreRun(@Arg('input', () => ScorRunInput) input: ScorRunInput): Promise<Competition> {
        console.log('input', JSON.stringify(input));

        const heat = await mapper.get(Object.assign(new Heat(), { id: input.allocatableId }));

        const seedSlots = await heat.getSeedSlots();

        const selectedSeedSlot = _.find(seedSlots, { userId: input.userId });

        const riderAllocationsLookup: { [key in string]: RiderAllocation } = {};

        const getFns = seedSlots.map((seedSlot) => async () => {
            riderAllocationsLookup[seedSlot.id] = await seedSlot.getRiderAllocation();
        });
        await Promise.all(getFns.map((fn) => fn()));

        riderAllocationsLookup[selectedSeedSlot.id].runs = input.runs;

        const newSeedSlotOrder = _.orderBy(seedSlots, (seedSlot) => riderAllocationsLookup[seedSlot.id].getBestScore());

        return null;
    }
}
