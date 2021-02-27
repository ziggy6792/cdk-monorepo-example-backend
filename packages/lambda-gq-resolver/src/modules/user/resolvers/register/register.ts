/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { IContext } from 'src/types';
import { mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import isAuthRoleMiddleware from 'src/middleware/is-auth-role-middleware';
import { createNotExistsCondition } from 'src/utils/utility';
import { RegisterInput } from './register-input';

@Resolver()
export default class RegisterResolver {
    @Query(() => String)
    async hello(@Ctx() ctx: IContext): Promise<string> {
        console.log('identity', ctx.identity);

        console.log('Running hello resolver');
        return 'Hello from my API';
    }

    @Mutation(() => User)
    async register(@Arg('input') input: RegisterInput, @Ctx() ctx: IContext): Promise<User> {
        console.log('identity', ctx.identity);

        const { id, firstName, lastName, email } = input;

        const user = new User();

        user.id = id;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        const createdUser = await mapper.put(user, { condition: createNotExistsCondition() });

        return createdUser;
    }
}
