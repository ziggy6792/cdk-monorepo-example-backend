/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { mapper } from 'src/utils/mapper';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { toArray } from 'src/utils/async-iterator';
import { RiderAllocationList, SeedSlotList } from 'src/domain/common-objects/lists';
import { DynamoDB } from 'aws-sdk';

import getEnvConfig from 'src/config/get-env-config';
import { commonConfig, commonUtils } from '@alpaca-backend/common';
import * as utils from 'src/utils/utility';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, GSISortKey, Model, Property } from '@shiftcoders/dynamo-easy';
import Round from './round';
import SeedSlot from './seed-slot';
import RiderAllocation from './rider-allocation';
import Creatable from './abstract/creatable';

export enum HeatStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    FINISHED = 'FINISHED',
}

registerEnumType(HeatStatus, {
    name: 'HeatStatus', // this one is mandatory
    description: 'The Heat Status', // this one is optional
});

@ObjectType()
@Model({ tableName: utils.getTableName(commonConfig.DB_SCHEMA.Heat.tableName) })
class Heat extends DataEntity {
    static store: DynamoStore<Heat>;

    @Field()
    when: string;

    @Field(() => ID)
    roundId: string;

    @Field(() => HeatStatus)
    status: HeatStatus;

    @Field(() => Int)
    progressionsPerHeat: number;

    @Field(() => Round, { name: 'round' })
    async getRound(): Promise<Round> {
        return mapper.get(Object.assign(new Round(), { id: this.roundId }));
    }

    async getSeedSlots(): Promise<SeedSlot[]> {
        return toArray(mapper.query(SeedSlot, { heatId: this.id }, { indexName: 'byHeat' }));
    }

    @Field(() => SeedSlotList)
    protected async seedSlots(): Promise<SeedSlotList> {
        const list = new SeedSlotList();
        list.items = await this.getSeedSlots();
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
        return this.getSeedSlots();
    }
}
Heat.store = new DynamoStore(Heat);

export default Heat;
