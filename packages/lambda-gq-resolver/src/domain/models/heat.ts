/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { mapper } from 'src/utils/mapper';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { toArray } from 'src/utils/async-iterator';
import { RiderAllocationList, SeedSlotList } from 'src/domain/common-objects/lists';
import { DynamoDB } from 'aws-sdk';

import getEnvConfig from 'src/config/get-env-config';
import { commonConfig, commonUtils } from '@simonverhoeven/common';
import * as utils from 'src/utils/utility';
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
@table(utils.getTableName(commonConfig.DB_SCHEMA.Heat.tableName))
class Heat extends DataEntity {
    @Field()
    @attribute()
    when: string;

    @Field(() => ID)
    @attribute()
    roundId: string;

    @Field(() => HeatStatus)
    @attribute()
    status: HeatStatus;

    @Field(() => Int)
    @attribute()
    progressionsPerHeat: number;

    @Field(() => Round, { name: 'selectedHeat' })
    async getSelectedHeat(): Promise<Round> {
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

export default Heat;
