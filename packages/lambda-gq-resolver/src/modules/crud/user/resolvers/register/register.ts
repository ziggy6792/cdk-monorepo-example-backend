/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import User from 'src/domain/models/user';

import DynamoStore from 'src/utils/dynamo-store';
import Competition, { CompetitionParams } from 'src/domain/models/competition';
import { update, UpdateExpressionDefinitionFunction } from '@shiftcoders/dynamo-easy';
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

        const userStore = new DynamoStore(User);

        const { firstName, lastName, email } = input;

        const user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        const userUpdate = new User();
        userUpdate.id = user.id;

        userUpdate.email = 'new email';

        console.log('userUpdate', userUpdate);

        const updateResponse = await userStore.update(userUpdate.id).updateAttribute('email').set('newValue').returnValues('ALL_NEW').exec();

        console.log('updateResponse', updateResponse);

        const competition = new Competition();

        competition.eventId = 'eventId';
        competition.judgeUserId = 'userId';

        competition.params = new CompetitionParams();

        competition.params.name = 'param name';

        // const competitionStore = new DynamoStore(Competition);

        await Competition.store.put(competition).ifNotExists().exec();

        const loadedComp = await Competition.store.loadOne(competition.id).exec();

        console.log('loadedComp params', loadedComp.params);
        loadedComp.myFunc();
        loadedComp.params.mySubFunc();

        return user;
    }

    @Mutation(() => User)
    async updateRegister(@Arg('input') input: RegisterInput, @Ctx() ctx: IContext): Promise<User> {
        console.log('identity', ctx.identity);

        const userStore = new DynamoStore(User);

        const { id, ...updates } = input;

        const updateOperations = Object.keys(updates).map((key) => update(key).set(input[key]));

        const updateResponse = await userStore
            .update(id)
            .operations(...updateOperations)
            .returnValues('ALL_NEW')
            .exec();

        return updateResponse;
    }
}
