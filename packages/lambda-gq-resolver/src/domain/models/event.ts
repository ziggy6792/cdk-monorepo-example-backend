import { commonConfig } from '@alpaca-backend/common';
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { CompetitionList } from 'src/domain/common-objects/lists';
import * as utils from 'src/utils/utility';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { Model } from '@shiftcoders/dynamo-easy';

import User from './user';
import Competition from './competition';
import Heat from './heat';
import Creatable from './abstract/creatable';

export enum EventStatus {
    REGISTRATION_OPEN = 'REGISTRATION_OPEN',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    FINALIZED = 'FINALIZED',
}

registerEnumType(EventStatus, {
    name: 'EventStatus', // this one is mandatory
    description: 'The Event Status', // this one is optional
});

const tableSchema = commonConfig.DB_SCHEMA.Event;

@Model({ tableName: utils.getTableName(tableSchema.tableName) })
@ObjectType()
class Event extends DataEntity {
    static store: DynamoStore<Event>;

    @Field()
    description: string;

    @Field()
    when: string;

    @Field(() => EventStatus)
    status: EventStatus;

    @Field()
    adminUserId: string;

    @Field()
    selectedHeatId: string;

    @Field(() => User)
    async adminUser(): Promise<User> {
        return mapper.get(Object.assign(new User(), { id: this.adminUserId }));
    }

    @Field(() => Heat)
    async selectedHeat(): Promise<Heat> {
        return mapper.get(Object.assign(new Heat(), { id: this.selectedHeatId }));
    }

    async getCompetitions(): Promise<Competition[]> {
        return Competition.store.query().index(commonConfig.DB_SCHEMA.Competition.indexes.byEvent.indexName).wherePartitionKey(this.id).execFetchAll();
    }

    @Field(() => CompetitionList)
    protected async competitions(): Promise<CompetitionList> {
        const list = new CompetitionList();
        list.items = await this.getCompetitions();
        return list;
    }

    async getChildren(): Promise<Creatable[]> {
        return this.getCompetitions();
    }
}

Event.store = new DynamoStore(Event);

export default Event;

// scheduleItems: [ScheduleItem] @connection(keyName: "bySchedule", fields: ["id"])
