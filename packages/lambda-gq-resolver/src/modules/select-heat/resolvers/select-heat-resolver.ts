/* eslint-disable class-methods-use-this */

import { Resolver, ID, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { IContext } from 'src/types';
import Event from 'src/domain/models/event';
import Heat, { HeatStatus } from 'src/domain/models/heat';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import { isHeatIdJudge } from 'src/middleware/auth-check/is-heat-judge';

@Resolver()
export default class SelectHeatResolver {
    @Mutation(() => Event)
    @UseMiddleware([createAuthMiddleware([isHeatIdJudge])])
    async selectHeat(@Arg('id', () => ID) heatId: string, @Ctx() ctx: IContext): Promise<Event> {
        const heat = await Heat.store.get(heatId).exec();

        const round = await heat.getRound();

        const competition = await round.getCompetition();

        const event = await competition.getEvent();

        await Heat.store.updateItem({ id: heatId, status: HeatStatus.OPEN }).ifExists().returnValues('ALL_NEW').exec();

        return Event.store.updateItem({ id: event.id, selectedHeatId: heatId }).ifExists().returnValues('ALL_NEW').exec();

        // return retHeat;
    }
}
