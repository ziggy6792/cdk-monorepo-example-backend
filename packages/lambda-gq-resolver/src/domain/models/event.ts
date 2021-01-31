/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ClassType } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { CompetitionList } from 'src/domain/common-objects/lists';
import User from './user';
import Competition from './competition';
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
@table('Event')
class Event extends DataEntity {
    @Field()
    @attribute()
    description: string;

    @Field()
    @attribute()
    when: string;

    @Field(() => EventStatus)
    @attribute()
    status: EventStatus;

    @Field()
    @attribute()
    adminUserId: string;

    @Field()
    @attribute()
    selectedHeatId: string;

    @Field(() => User)
    async adminUser(): Promise<User> {
        return mapper.get(Object.assign(new User(), { id: this.adminUserId }));
    }

    @Field(() => Heat)
    async selectedHeat(): Promise<Heat> {
        return mapper.get(Object.assign(new Heat(), { id: this.selectedHeatId }));
    }

    @Field(() => CompetitionList)
    async competitions(): Promise<CompetitionList> {
        const filter: ConditionExpression = {
            subject: 'eventId',
            ...equals(this.id),
        };
        const items = await toArray(mapper.scan(Competition, { filter }));
        const list = new CompetitionList();
        list.items = items;
        return list;
    }
}

export default Event;

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])
