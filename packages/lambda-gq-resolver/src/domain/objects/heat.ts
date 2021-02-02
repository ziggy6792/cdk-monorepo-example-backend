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
import * as models from 'src/domain/models';
import Round from './round';
import SeedSlot from './seed-slot';
import RiderAllocation from './rider-allocation';

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
class Heat extends models.Heat {
    @Field(() => SeedSlotList)
    async seedSlots(): Promise<SeedSlotList> {
        const list = new SeedSlotList();
        list.items = await this.getSeedSlots();
        return list;
    }

    @Field(() => RiderAllocationList)
    async riderAllocations(): Promise<RiderAllocationList> {
        const list = new RiderAllocationList();
        list.items = await this.getRiderAllocations();
        return list;
    }
}

export default Heat;
