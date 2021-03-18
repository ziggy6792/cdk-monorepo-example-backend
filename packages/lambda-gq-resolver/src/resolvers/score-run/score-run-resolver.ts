/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import _ from 'lodash';
import Heat, { HeatStatus } from 'src/domain/models/heat';
import { ScorRunInput } from 'src/resolvers/score-run/inputs/score-run-inputs';
import RiderAllocation from 'src/domain/models/rider-allocation';
import errorMessage from 'src/config/error-message';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import { isHeatInputJudge } from 'src/middleware/auth-check/is-heat-judge';
import { mapDbException } from 'src/utils/utility';

@Resolver()
export default class ScoreRun {
    @Mutation(() => Heat)
    @UseMiddleware([createAuthMiddleware([isHeatInputJudge])])
    async scoreRun(@Arg('input', () => ScorRunInput) input: ScorRunInput): Promise<Heat> {
        const { heatId, ...rest } = input;

        const riderAllocationUpdateParams = {
            allocatableId: heatId,
            ...rest,
        };

        const heat = await Heat.store.get(input.heatId).exec();

        if (heat.status !== HeatStatus.OPEN) {
            throw new Error(errorMessage.heatNotOpen);
        }

        try {
            await RiderAllocation.store.updateItem(riderAllocationUpdateParams).exec();
        } catch (err) {
            throw mapDbException(err, errorMessage.canNotFindRider);
        }

        return heat;
    }
}