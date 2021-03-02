/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg } from 'type-graphql';
import Competition from 'src/domain/models/competition';
import _ from 'lodash';
import Heat from 'src/domain/models/heat';
import { UpdateRiderAllocationInput } from 'src/modules/crud/rider-allocation/inputs/rider-allocation-inputs';

@Resolver()
export default class ScoreRun {
    @Mutation(() => Heat, { nullable: true })
    // @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async scoreRun(@Arg('input', () => UpdateRiderAllocationInput) input: UpdateRiderAllocationInput): Promise<Competition> {
        console.log('input', JSON.stringify(input));

        return null;
    }
}
