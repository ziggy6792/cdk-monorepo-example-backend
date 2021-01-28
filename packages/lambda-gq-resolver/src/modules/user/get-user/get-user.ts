/* eslint-disable class-methods-use-this */

import { Resolver, Query, Arg } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import User from 'src/domain-models/user';

@Resolver()
export default class GetUserResolver {
    @Query(() => User, { nullable: true })
    async getUser(@Arg('id') id: string): Promise<User | null> {
        try {
            const user = await mapper.get(Object.assign(new User(), { id }));
            return user;
        } catch (err) {
            return null;
        }
    }
}
