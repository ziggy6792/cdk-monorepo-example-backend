/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, ObjectType, Root, registerEnumType } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import { threadId } from 'worker_threads';
import moment from 'src/utils/moment';
import User from './user';
import BaseModelWithId from './abstract-models/base-model-with-id';

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
class Event extends BaseModelWithId {
    @Field()
    @attribute()
    name: string;

    @Field()
    @attribute()
    description: string;

    @Field()
    @attribute()
    when: string;

    @Field((type) => EventStatus)
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
}

export default Event;
