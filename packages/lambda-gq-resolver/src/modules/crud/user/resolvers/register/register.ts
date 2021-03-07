/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import User from 'src/domain/models/user';

import DynamoStore from 'src/utils/dynamo-store';
import Competition, { CompetitionParams } from 'src/domain/models/competition';
import { BatchGetRequest, update, UpdateExpressionDefinitionFunction } from '@shiftcoders/dynamo-easy';
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

        const loadedComp = await Competition.store.get(competition.id).exec();

        const findComps = await Competition.store.query().wherePartitionKey('c3cd8e65-3f95-491a-9bba-beeaa0841c41').execFetchAll();

        const request = Competition.store.query().index('byEvent').wherePartitionKey('bla');

        const findCompsByEvent = await Competition.store.query().index('byEvent').wherePartitionKey('eventId').execFetchAll();

        // console.log('findComps', findComps);
        // console.log('findCompsByEvent', findCompsByEvent);

        // findCompsByEvent.forEach((competition) => {
        //     competition.myFunc();
        // });
        const keysToFetch: Array<Partial<Competition>> = [{ id: 'd187bf62-1da8-4981-91dc-20adbf2f2df6' }, { id: '8683b7a8-f38d-4a82-bbf4-1939322a574b' }];

        const batchGetComps = await Competition.store.batchGet(keysToFetch).exec();

        console.log('batchGetComps', batchGetComps);

        await batchGetComps[0].myFunc();

        // return toArray(mapper.query(Competition, { eventId: this.id }, { indexName: 'byEvent' }));

        // console.log('loadedComp params', loadedComp.params);
        // loadedComp.myFunc();
        // loadedComp.params.mySubFunc();

        return user;
    }

    @Mutation(() => User)
    async updateRegister(@Arg('input') input: RegisterInput, @Ctx() ctx: IContext): Promise<User> {
        console.log('identity', ctx.identity);

        const userStore = new DynamoStore(User);

        const { id, ...updates } = input;

        const updateResponse = await userStore.update(id).values(updates).returnValues('ALL_NEW').exec();

        console.log('Full name', updateResponse.getFullName());

        return updateResponse;
    }
}
