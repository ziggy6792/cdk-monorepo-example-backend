/* eslint-disable class-methods-use-this */

import { Resolver, ID, Mutation, Arg, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import Event from 'src/domain/models/event';
import Heat, { HeatStatus } from 'src/domain/models/heat';

@Resolver()
export default class SelectHeatResolver {
    @Mutation(() => Heat)
    async selectHeat(@Arg('id', () => ID) heatId: string, @Ctx() ctx: IContext): Promise<Heat> {
        console.log('identity', ctx.identity);

        const heat = await Heat.store.get(heatId).exec();

        const round = await heat.getRound();

        const competition = await round.getCompetition();

        const event = await competition.getEvent();

        const retHeat = Heat.store.updateItem({ id: heatId, status: HeatStatus.OPEN }).ifExists().returnValues('ALL_NEW').exec();

        await Event.store.updateItem({ id: event.id, selectedHeatId: heatId }).exec();

        return retHeat;
    }
}
