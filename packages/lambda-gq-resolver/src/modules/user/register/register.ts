/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { Context } from 'src/types';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import User from 'src/domain-models/user';
import { isAuthUser } from 'src/modules/middleware/is-auth-user';
import { RegisterInput } from './register-input';

@Resolver()
export default class RegisterResolver {
    @Query(() => String)
    async hello(@Ctx() ctx: Context): Promise<string> {
        console.log('identity', ctx.identity);

        console.log('Running hello resolver');
        return 'Hello from my slot booking API';
    }

    @Mutation(() => User)
    async register(@Arg('input') input: RegisterInput, @Ctx() ctx: Context): Promise<User> {
        console.log('identity', ctx.identity);

        const { id, firstName, lastName, email } = input;

        const user = new User();

        user.id = id;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        const createdUser = await mapper.put(user, { condition: createUniqueCondition() });

        return createdUser;
    }
}
