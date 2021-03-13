/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import _ from 'lodash';
import Heat from 'src/domain/models/heat';
import { ScorRunInput } from 'src/modules/score-run/inputs/score-run-inputs';
import RiderAllocation from 'src/domain/models/rider-allocation';
import errorMessage from 'src/config/error-message';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isHeatJudge from 'src/middleware/auth-check/is-heat-judge';

@Resolver()
export default class ScoreRun {
    @Mutation(() => Heat)
    @UseMiddleware([createAuthMiddleware([isHeatJudge])])
    async scoreRun(@Arg('input', () => ScorRunInput) input: ScorRunInput): Promise<Heat> {
        const { heatId, ...rest } = input;

        const riderAllocationUpdateParams = {
            allocatableId: heatId,
            ...rest,
        };
        const [heat, _] = await Promise.all([Heat.store.get(input.heatId).exec(), RiderAllocation.store.updateItem(riderAllocationUpdateParams).exec()]);

        return heat;
    }
}
