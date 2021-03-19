import { commonConfig } from '@alpaca-backend/common';
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, GraphQLISODateTime } from 'type-graphql';
import DataEntity from 'src/domain/interfaces/data-entity';
import { CompetitionList } from 'src/domain/objects/lists';
import * as utils from 'src/utils/utility';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { MapperForType, Model, Property, StringAttribute } from '@shiftcoders/dynamo-easy';

import Identifiable from 'src/domain/interfaces/identifiable';
import Creatable from 'src/domain/interfaces/creatable';
import { parseISO } from 'date-fns';
import dateMapper from 'src/utils/dynamo-easy/mappers/date-mapper';
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

const tableSchema = commonConfig.DB_SCHEMA.Event;

@ObjectType({ implements: [DataEntity, Identifiable, Creatable] })
@Model({ tableName: utils.getTableName(tableSchema.tableName) })
class Event extends DataEntity {
    static store: DynamoStore<Event>;

    constructor() {
        super();
        this.status = EventStatus.REGISTRATION_CLOSED;
    }

    @Field()
    description: string;

    @Field()
    @Property({ mapper: dateMapper })
    startTime: Date;

    @Field({ nullable: true })
    startTime2(): Date {
        return new Date();
    }

    @Field(() => EventStatus)
    status: EventStatus;

    @Field()
    adminUserId: string;

    @Field()
    selectedHeatId: string;

    @Field(() => User, { name: 'adminUser' })
    async getAdminUser(): Promise<User> {
        return User.store.get(this.adminUserId).exec();
    }

    @Field(() => Heat, { name: 'selectedHeat' })
    async getSelectedHeat(): Promise<Heat> {
        return Heat.store.get(this.selectedHeatId).exec();
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
