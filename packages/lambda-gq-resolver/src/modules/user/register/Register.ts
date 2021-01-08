/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import { Resolver, Query, Mutation, Arg, FieldResolver, Root, Ctx } from 'type-graphql';
import { FunctionExpression, AttributePath } from '@aws/dynamodb-expressions';
import { MyContext } from '../../../types/MyContext';
import { createUniqueCondition, mapper } from '../../../utils/mapper';
import User from '../../../domain-models/User';
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
