/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { commonConfig, commonUtils } from '@simonverhoeven/common';

import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { RiderAllocationList, RoundList } from 'src/domain/common-objects/lists';
import getEnvConfig from 'src/config/get-env-config';
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
class CompetitionParams {
    @Field()
    @attribute()
    name: string;
}
// commonUtils.getTableName(commonConfig.DB_SCHEMA.Competition.tableName, getEnvConfig().ENV)
@ObjectType()
@table('Competition')
class Competition extends DataEntity {
    @Field()
    @attribute()
    description: string;

    @Field()
    @attribute()
    category: string;

    @Field(() => ID)
    @attribute()
    eventId: string;

    @Field(() => ID)
    @attribute()
    judgeUserId: string;

    @Field()
    @attribute()
    when: string;

    @Field(() => CompetitionStatus)
    @attribute()
    status: CompetitionStatus;

    @Field(() => CompetitionParams)
    @attribute()
    params: CompetitionParams;

    @Field()
    @attribute()
    selectedHeatId: string;

    @Field(() => Int)
    @attribute()
    maxRiders: string;

    @Field(() => Gender)
    @attribute()
    gender: Gender;

    @Field(() => Sport)
    @attribute()
    sport: Sport;

    @Field(() => Level)
    @attribute()
    level: Level;

    @Field(() => User, { name: 'judgeUser' })
    async getJudgeUser(): Promise<User> {
        return mapper.get(Object.assign(new User(), { id: this.judgeUserId }));
    }

    @Field(() => Event, { name: 'event' })
    async getEvent(): Promise<Event> {
        return mapper.get(Object.assign(new Event(), { id: this.eventId }));
    }

    async getRounds(): Promise<Round[]> {
        const filter: ConditionExpression = {
            subject: 'competitionId',
            ...equals(this.id),
        };
        return toArray(mapper.scan(Round, { filter }));
    }

    @Field(() => RoundList)
    protected async rounds(): Promise<RoundList> {
        const list = new RoundList();
        list.items = await this.getRounds();
        return list;
    }

    async getRiderAllocations(): Promise<RiderAllocation[]> {
        const filter: ConditionExpression = {
            subject: 'allocatableId',
            ...equals(this.id),
        };
        return toArray(mapper.scan(RiderAllocation, { filter }));
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
}

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])

export default Competition;
