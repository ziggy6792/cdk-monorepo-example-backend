/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { RiderAllocationList, RoundList } from 'src/domain/common-objects/lists';
import * as models from 'src/domain/models';
import User from './user';
import Event from './event';
import Round from './round';
import RiderAllocation from './rider-allocation';

@ObjectType()
export class Competition extends models.Competition {
    @Field(() => User, { name: 'judgeUser' })
    async getJudgeUser(): Promise<User> {
        return mapper.get(Object.assign(new User(), { id: this.judgeUserId }));
    }

    @Field(() => Event, { name: 'event' })
    async getEvent(): Promise<Event> {
        return mapper.get(Object.assign(new Event(), { id: this.eventId }));
    }

    @Field(() => RoundList)
    async rounds(): Promise<RoundList> {
        const list = new RoundList();
        list.items = await this.getRounds();
        return list;
    }

    @Field(() => RiderAllocationList, { name: 'riderAllocations' })
    async rderAllocations(): Promise<RiderAllocationList> {
        const list = new RiderAllocationList();
        list.items = await this.getRderAllocations();
        return list;
    }
}

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])

export default Competition;
