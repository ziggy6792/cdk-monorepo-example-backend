/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { IContext } from 'src/types';
import User from 'src/domain/models/user';

import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import TransactGetRequest from 'src/utils/dynamo-easy/transact-get-request';
import TransactWriteRequest from 'src/utils/dynamo-easy/transact-write-request';
import Competition, { CompetitionParams } from 'src/domain/models/competition';
import {
    attribute,
    BatchGetRequest,
    TransactConditionCheck,
    TransactDelete,
    TransactPut,
    TransactUpdate,
    update,
    UpdateExpressionDefinitionFunction,
} from '@shiftcoders/dynamo-easy';
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

        // PUT
        const user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await userStore.put(user).exec();

        console.log('Put user', user);

        // UPDATE
        const userUpdate = new User();

        userUpdate.id = user.id;

        userUpdate.email = 'new email';

        console.log('userUpdate', userUpdate);

        const updateResponse = await userStore.update(userUpdate.id).updateAttribute('email').set('newValue').returnValues('ALL_NEW').exec();

        console.log('updateResponse', updateResponse);

        // QUERY

        const competition = new Competition();

        competition.eventId = 'eventId';
        competition.judgeUserId = 'userId';

        competition.params = new CompetitionParams();

        competition.params.name = 'param name';

        // const competitionStore = new DynamoStore(Competition);

        await Competition.store.put(competition).ifNotExists().exec();

        const loadedComp = await Competition.store.get(competition.id).exec();

        const findComps = await Competition.store.query().wherePartitionKey('5-3f95-491a-9bba-beeaa0841c41').execFetchAll();

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

        // await batchGetComps[0].myFunc();

        const competition2 = new Competition();

        competition2.eventId = 'eventId';
        competition2.judgeUserId = 'userId';

        competition2.params = new CompetitionParams();

        competition2.params.name = 'param name';

        const batchPutCompetitions = [competition2];

        await Competition.store.myBatchWrite().put(batchPutCompetitions).exec();

        // Competition.store.

        console.log('batchPut', batchPutCompetitions);

        console.log('metadata', Competition.store);

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

        const updateResponse = await userStore.updateItem(input).returnValues('ALL_NEW').exec();

        console.log('Full name', updateResponse.getFullName());

        return updateResponse;
    }

    @Mutation(() => User, { nullable: true })
    async transactGetExample(@Ctx() ctx: IContext): Promise<User> {
        console.log('identity', ctx.identity);

        const batchGet = new TransactGetRequest()
            .returnConsumedCapacity('TOTAL')
            .forModel(User, { id: 'b1650bb0-dcfc-44d6-8ba7-e99ba1538ca3' })
            .forModel(Competition, { id: 'e57e33bf-5237-4bc6-9c41-f2664d7a8154' });

        // batchGet.

        const items = await batchGet.exec();

        console.log('items', items);

        return null;
    }

    @Mutation(() => User, { nullable: true })
    async transactWriteExample(@Ctx() ctx: IContext): Promise<User> {
        console.log('identity', ctx.identity);

        const competition1 = new Competition();
        competition1.eventId = 'eventId';
        competition1.judgeUserId = 'userId';
        competition1.params = new CompetitionParams();
        competition1.params.name = 'param name';
        await Competition.store.put(competition1).ifNotExists().exec();

        const competition2 = new Competition();
        competition2.eventId = 'eventId';
        competition2.judgeUserId = 'userId';
        competition2.params = new CompetitionParams();
        competition2.params.name = 'param name';
        await Competition.store.put(competition2).ifNotExists().exec();

        const batchWrite = new TransactWriteRequest().transact(
            new TransactConditionCheck(Competition, competition1.id).onlyIf(attribute('modifiedAt').equals(competition1.modifiedAt)),
            new TransactUpdate(Competition, competition2.id).updateAttribute('eventId').set('testBatchWrite')
        );

        // batchGet.

        const items = await batchWrite.exec();

        console.log('items', items);

        return null;
    }

    @Mutation(() => User, { nullable: true })
    async scanExample(@Ctx() ctx: IContext): Promise<User> {
        const competitions = await Competition.store.scan().execFetchAll();

        console.log('competitions', competitions);

        competitions[0].myFunc();

        return null;
    }
}
