/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { commonConfig } from '@alpaca-backend/common';

import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import { RiderAllocationList, RoundList } from 'src/domain/common-objects/lists';
import * as utils from 'src/utils/utility';
import { GSIPartitionKey, GSISortKey, Model, Property } from '@shiftcoders/dynamo-easy';
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
export class CompetitionParams {
    @Field()
    name: string;

    mySubFunc(): void {
        console.log('running my sub func');
    }
}
@ObjectType()
@Model({ tableName: utils.getTableName(commonConfig.DB_SCHEMA.Competition.tableName) })
class Competition extends DataEntity {
    constructor() {
        super();
        this.params = new CompetitionParams();
    }

    static store: DynamoStore<Competition>;

    // static Load(initalValues: Competition): Competition {
    //     return _.merge(new Competition(), initalValues);
    // }

    @Field()
    description: string;

    @Field()
    category: string;

    @Field(() => ID)
    @Property()
    @GSIPartitionKey('byEvent')
    eventId: string;

    @Field(() => ID)
    @Property()
    @GSISortKey('byEvent')
    createdAt: string;

    @Field(() => ID)
    judgeUserId: string;

    @Field()
    when: string;

    @Field(() => CompetitionStatus)
    status: CompetitionStatus;

    @Field(() => CompetitionParams)
    params: CompetitionParams;

    @Field()
    selectedHeatId: string;

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
        return mapper.get(Object.assign(new User(), { id: this.judgeUserId }));
    }

    @Field(() => Event, { name: 'event' })
    async getEvent(): Promise<Event> {
        return mapper.get(Object.assign(new Event(), { id: this.eventId }));
    }

    async getRounds(filter: ConditionExpression = undefined): Promise<Round[]> {
        return toArray(mapper.query(Round, { competitionId: this.id }, { indexName: 'byCompetition', filter }));
    }

    @Field(() => RoundList)
    protected async rounds(): Promise<RoundList> {
        const list = new RoundList();
        list.items = await this.getRounds();
        return list;
    }

    async getRiderAllocations(): Promise<RiderAllocation[]> {
        return toArray(mapper.query(RiderAllocation, { allocatableId: this.id }, { indexName: 'byAllocatable' }));
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

    async myFunc(): Promise<void> {
        console.log('running my func 2');
        const comp = await Competition.store.get('ee971d12-36c8-4422-b8c3-0aa3d3ea5254').exec();
        console.log('my func', comp);
    }
}

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])

Competition.store = new DynamoStore(Competition);

export default Competition;
