/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { MyContext } from 'src/types/MyContext';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import User from 'src/domain-models/User';
import { RegisterInput } from './RegisterInput';

@Resolver()
export default class RegisterResolver {
    @Query(() => String)
    async hello(@Ctx() ctx: MyContext): Promise<string> {
        console.log('identity', ctx.identity);

        console.log('Running hello resolver');
        return 'Hello World';
    }

    @Mutation(() => User)
    async register(@Arg('input') input: RegisterInput, @Ctx() ctx: MyContext): Promise<User> {
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
