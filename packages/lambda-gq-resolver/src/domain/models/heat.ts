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
@table('Heat')
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

    @Field(() => Round)
    async selectedHeat(): Promise<Round> {
        return mapper.get(Object.assign(new Round(), { id: this.roundId }));
    }

    @Field(() => SeedSlotList)
    async seedSlots(): Promise<SeedSlotList> {
        const filter: ConditionExpression = {
            subject: 'eventId',
            ...equals(this.id),
        };
        const items = await toArray(mapper.scan(SeedSlot, { filter }));
        const list = new SeedSlotList();
        list.items = items;
        return list;
    }

    @Field(() => RiderAllocationList)
    async riderAllocations(): Promise<RiderAllocationList> {
        const filter: ConditionExpression = {
            subject: 'allocatableId',
            ...equals(this.id),
        };
        const items = await toArray(mapper.scan(RiderAllocation, { filter }));
        const list = new RiderAllocationList();
        list.items = items;
        return list;
    }
}

export default Heat;
