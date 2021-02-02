/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { CompetitionList } from 'src/domain/common-objects/lists';
import * as models from 'src/domain/models';
import User from './user';
import CompetitionModel from './competition';
import Heat from './heat';

export enum EventStatus {
    REGISTRATION_OPEN = 'REGISTRATION_OPEN',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    FINALIZED = 'FINALIZED',
}

registerEnumType(EventStatus, {
    name: 'EventStatus', // this one is mandatory
    description: 'The Event Status', // this one is optional
});

@ObjectType()
class Event extends models.Event {
    @Field(() => User)
    async adminUser(): Promise<User> {
        return this.getAdminUser();
    }

    @Field(() => Heat)
    async selectedHeat(): Promise<Heat> {
        return this.getSelectedHeat();
    }

    @Field(() => CompetitionList)
    async competitions(): Promise<CompetitionList> {
        const list = new CompetitionList();
        list.items = await this.getCompetitions();
        return list;
    }
}

export default Event;

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])
