/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { IContext } from 'src/types';
import { mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import deafultAuthMiddleware from 'src/middleware/default-auth-middleware';
import { createNotExistsCondition } from 'src/utils/utility';
import util from 'util';
import promisify from 'js-promisify';
import getEnvConfig from 'src/config/get-env-config';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import DynamoStore from 'src/utils/dynamo-store';
import { RegisterInput } from './register-input';

const { awsConfig } = getEnvConfig();

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

        const userStore = new DynamoStore(User);

        const { id, firstName, lastName, email } = input;

        const user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        const response = await userStore.put(user).ifNotExists().exec();

        const userUpdate = new User();
        userUpdate.id = user.id;

        userUpdate.email = 'new email';

        console.log('userUpdate', userUpdate);

        const updateResponse = await userStore.update(userUpdate.id).updateAttribute('email').set('newValue').returnValues('ALL_NEW').exec();

        console.log('updateResponse', updateResponse);

        return user;
    }
}
