/* eslint-disable class-methods-use-this */

import { Resolver, ID, Mutation, Arg, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import User from 'src/domain/models/user';
import Heat from 'src/domain/models/heat';

@Resolver()
export default class SelectHeatResolver {
    @Mutation(() => User)
    async selectHeat(@Arg('id', () => ID) heatId: string, @Ctx() ctx: IContext): Promise<Heat> {
        console.log('identity', ctx.identity);

        const heat = await Heat.store.get(heatId).exec();

        return heat;
    }
}
