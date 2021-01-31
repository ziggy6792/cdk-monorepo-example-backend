/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ClassType } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/abstract-models/data-entity';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import List from 'src/domain/sub-models/list';
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

// function createListType<T extends ClassType>(objectTypeCls: T) {
//     @ObjectType()
//     class BaseResolver {
//         //   protected items: T[] = [];

//         //   @Query(type => [objectTypeCls], { name: `getAll${suffix}` })
//         //   async getAll(@Arg("first", type => Int) first: number): Promise<T[]> {
//         //     return this.items.slice(0, first);
//         //   }

//         @Field((type) => [objectTypeCls])
//         @attribute()
//         items: T[];
//     }

//     return BaseResolver;
// }

// const ListType = createListType(Competition);
// class CompetitionList extends ListType {
//     // ...
// }
@ObjectType()
class CompetitionList {
    @Field((type) => [Competition])
    @attribute()
    items: Competition[];
}

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
        // const competitions = await toArray(mapper.query(Competition, { eventId: this.id }));

        const filter: ConditionExpression = {
            subject: 'eventId',
            ...equals(this.id),
        };
        const competitions = await toArray(mapper.scan(Competition, { filter }));

        const list = new CompetitionList();

        list.items = competitions;

        return list;
    }
}

export default Event;

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])
