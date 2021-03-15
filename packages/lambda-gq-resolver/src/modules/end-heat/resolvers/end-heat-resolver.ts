/* eslint-disable class-methods-use-this */

import { Resolver, ID, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql';
import Event from 'src/domain/models/event';
import Heat, { HeatStatus } from 'src/domain/models/heat';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import { isHeatIdJudge } from 'src/middleware/auth-check/is-heat-judge';
import Competition from 'src/domain/models/competition';
import { IContext } from 'src/types';
import RiderAllocation from 'src/domain/models/rider-allocation';
import BatchWriteRequest from 'src/utils/dynamo-easy/batch-write-request';
import _ from 'lodash';
import { BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';

@Resolver()
export default class EndHeatResolver {
    @Mutation(() => Competition)
    @UseMiddleware([createAuthMiddleware([isHeatIdJudge])])
    async endHeat(@Arg('id', () => ID) heatId: string, @Ctx() context: IContext): Promise<Competition> {
        const heat = await Heat.store.get(heatId).exec();

        const riderAllocations = await heat.getSortedRiderAllocations(context);

        const rasToCreate: RiderAllocation[] = [];

        riderAllocations.forEach((ra, i) => {
            const seedSlot = heat.seedSlots[i];
            const nextRA = new RiderAllocation();
            nextRA.userId = ra.userId;
            nextRA.allocatableId = seedSlot.nextHeatId;
            nextRA.startSeed = seedSlot.seed;
            nextRA.initRuns();
            rasToCreate.push(nextRA);
        });

        const round = await heat.getRound();

        const competition = await round.getCompetition();

        await Promise.all([...new BatchWriteRequest().putChunks(_.chunk(rasToCreate, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec())]);

        await Heat.store.updateItem({ id: heatId, status: HeatStatus.CLOSED }).exec();

        return competition;

        // return retHeat;
    }
}
