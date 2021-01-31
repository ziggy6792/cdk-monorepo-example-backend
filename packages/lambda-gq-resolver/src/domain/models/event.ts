/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/abstract-models/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import User from './user';
import Competition from './competition';

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

    @Field(() => [Competition])
    async competitions(): Promise<Competition[]> {
        // const competitions = await toArray(mapper.query(Competition, { eventId: this.id }));

        const filter: ConditionExpression = {
            subject: 'eventId',
            ...equals(this.id),
        };
        const competitions = await toArray(mapper.scan(Competition, { filter }));

        return competitions;
    }
}

export default Event;

// adminUser: User @connection(fields: ["adminUserId"])
// competitions: [Competition] @connection(keyName: "byEvent", fields: ["id"])
// selectedHeat: Heat @connection(fields: ["selectedHeatId"])
// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])
