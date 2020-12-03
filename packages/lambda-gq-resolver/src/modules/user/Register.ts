/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { FunctionExpression, AttributePath } from '@aws/dynamodb-expressions';
import { createUniqueCondition, mapper } from '../../util/mapper';
import User from '../../domain-models/User';

@Resolver(User)
export default class RegisterResolver {
  @Query(() => String)
  async hello(): Promise<string> {
    console.log('Running hello resolver');
    return 'Hello World';
  }

  @FieldResolver()
  async fullName(@Root() parent: User): Promise<string> {
    return parent.getFullName();
  }

  @Mutation(() => User)
  async register(@Arg('firstName') firstName: string, @Arg('lastName') lastName: string, @Arg('email') email: string): Promise<User> {
    // Create Simon
    const user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.generateId();

    await mapper.put(user, { condition: createUniqueCondition() });

    return user;
  }
}
