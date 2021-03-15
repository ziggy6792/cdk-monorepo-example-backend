/* eslint-disable class-methods-use-this */

import { Resolver, Ctx, Query } from 'type-graphql';
import { IContext } from 'src/types';

@Resolver()
export default class HelloResolver {
    @Query(() => String)
    async hello(@Ctx() ctx: IContext): Promise<string> {
        console.log('identity', ctx.identity);

        console.log('Running hello resolver');
        return 'Hello from my API';
    }
}
