/* eslint-disable class-methods-use-this */

import { Resolver, Query, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import { mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';

@Resolver()
export default class GetMeResolver {
    @Query(() => User, { nullable: true })
    // @UseMiddleware(isAuthUserOrRole)
    async getMe(@Ctx() ctx: IContext): Promise<User | null> {
        const me = await mapper.get(Object.assign(new User(), { id: ctx.identity.user.username }));
        return me;
    }
}
