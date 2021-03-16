/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { commonConfig } from '@alpaca-backend/common';

import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { RiderAllocationList, RoundList } from 'src/domain/common-objects/lists';
import * as utils from 'src/utils/utility';
import { ConditionExpressionDefinitionFunction, GSIPartitionKey, Model, Property } from '@shiftcoders/dynamo-easy';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import User from './user';
import Event from './event';
import Round from './round';
import RiderAllocation from './rider-allocation';
import Creatable from './abstract/creatable';

export enum CompetitionStatus {
    REGISTRATION_OPEN = 'REGISTRATION_OPEN',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    FINALIZED = 'FINALIZED',
}

export enum Gender {
    ANY = 'ANY',
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export enum Sport {
    WAKEBOARD = 'WAKEBOARD',
    WAKESKATE = 'WAKESKATE',
}

export enum Level {
    ANY = 'ANY',
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    PROFESSIONAL = 'PROFESSIONAL',
}

registerEnumType(CompetitionStatus, {
    name: 'CompetitionStatus', // this one is mandatory
    description: 'The Competition Status', // this one is optional
});

registerEnumType(Gender, {
    name: 'Gender', // this one is mandatory
    description: 'Gender', // this one is optional
});

registerEnumType(Sport, {
    name: 'Sport', // this one is mandatory
    description: 'Sport', // this one is optional
});

registerEnumType(Level, {
    name: 'Level', // this one is mandatory
    description: 'Level', // this one is optional
});

@ObjectType()
@Model()
export class CompetitionParams {
    @Field()
    name: string;
}

const tableSchema = commonConfig.DB_SCHEMA.Competition;

@ObjectType()
@Model({ tableName: utils.getTableName(tableSchema.tableName) })
class Competition extends DataEntity {
    constructor() {
        super();
        this.params = new CompetitionParams();
    }

    static store: DynamoStore<Competition>;

    @Field()
    description: string;

    @Field()
    category: string;

    @Field(() => ID)
    @Property()
    @GSIPartitionKey(tableSchema.indexes.byEvent.indexName)
    eventId: string;

    @Field()
    @Property()
    createdAt: string;

    @Field(() => ID)
    judgeUserId: string;

    @Field()
    when: string;

    @Field(() => CompetitionStatus)
    status: CompetitionStatus;

    @Field(() => CompetitionParams)
    params: CompetitionParams;

    @Field(() => Int)
    maxRiders: string;

    @Field(() => Gender)
    gender: Gender;

    @Field(() => Sport)
    sport: Sport;

    @Field(() => Level)
    level: Level;

    @Field(() => User, { name: 'judgeUser' })
    async getJudgeUser(): Promise<User> {
        return User.store.get(this.judgeUserId).exec();
    }

    @Field(() => Event, { name: 'event' })
    async getEvent(): Promise<Event> {
        return Event.store.get(this.eventId).exec();
    }

    async getRounds(filter: ConditionExpressionDefinitionFunction[] = undefined): Promise<Round[]> {
        const request = Round.store.query().index(commonConfig.DB_SCHEMA.Round.indexes.byCompetition.indexName).wherePartitionKey(this.id);
        return filter ? request.where(...filter).execFetchAll() : request.execFetchAll();
    }

    @Field(() => RoundList)
    protected async rounds(): Promise<RoundList> {
        const list = new RoundList();
        list.items = await this.getRounds();
        return list;
    }

    async getRiderAllocations(): Promise<RiderAllocation[]> {
        return RiderAllocation.store
            .query()
            .index(commonConfig.DB_SCHEMA.RiderAllocation.indexes.byAllocatable.indexName)
            .wherePartitionKey(this.id)
            .execFetchAll();
    }

    @Field(() => RiderAllocationList)
    protected async riderAllocations(): Promise<RiderAllocationList> {
        const list = new RiderAllocationList();
        list.items = await this.getRiderAllocations();
        return list;
    }

    async getChildren(): Promise<Creatable[]> {
        return this.getRounds();
    }

    async isUserAllowedToJudge(userId: string): Promise<boolean> {
        if (!userId) {
            return false;
        }
        if (userId === this.judgeUserId) {
            return true;
        }

        const event = await this.getEvent();
        return event.adminUserId === userId;
    }
}

Competition.store = new DynamoStore(Competition);

export default Competition;
