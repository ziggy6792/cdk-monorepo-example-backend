/* eslint-disable class-methods-use-this */

import { Resolver, Query, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import User from 'src/domain/models/user';

@Resolver()
export default class GetMeResolver {
    @Query(() => User, { nullable: true })
    // @UseMiddleware(isAuthUserOrRole)
    async getMe(@Ctx() ctx: IContext): Promise<User | null> {
        const me = await User.store.get(ctx.identity.user.username).exec();

        return me;
    }
}
