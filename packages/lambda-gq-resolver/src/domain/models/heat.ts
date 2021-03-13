/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { RiderAllocationList } from 'src/domain/common-objects/lists';
import { commonConfig } from '@alpaca-backend/common';
import * as utils from 'src/utils/utility';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, Model } from '@shiftcoders/dynamo-easy';
import Round from './round';
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

const tableSchema = commonConfig.DB_SCHEMA.Heat;

@ObjectType()
export class SeedSlot {
    @Field(() => Int)
    seed: number;

    @Field(() => ID, { nullable: true })
    nextHeatId: string;

    @Field(() => Heat, { nullable: true, name: 'nextHeat' })
    async getNextHeat(): Promise<Heat> {
        if (!this.nextHeatId) {
            return null;
        }
        return Heat.store.get(this.nextHeatId).exec();
    }
}

@ObjectType()
@Model({ tableName: utils.getTableName(tableSchema.tableName) })
class Heat extends DataEntity {
    static store: DynamoStore<Heat>;

    constructor() {
        super();
        this.seedSlots = [];
    }

    mapIn(loadedValues: any): void {
        super.mapIn(loadedValues);
        console.log('RUNNING Heat mapIn');
        console.log(this.seedSlots);
        this.seedSlots = this.seedSlots.map((seedSlot) => _.merge(new SeedSlot(), seedSlot));
    }

    @Field()
    when: string;

    @Field(() => ID)
    @GSIPartitionKey(tableSchema.indexes.byRound.indexName)
    roundId: string;

    @Field(() => HeatStatus)
    status: HeatStatus;

    @Field(() => Int)
    progressionsPerHeat: number;

    @Field(() => Round, { name: 'round' })
    async getRound(): Promise<Round> {
        return Round.store.get(this.roundId).exec();
    }

    @Field(() => [SeedSlot])
    seedSlots: SeedSlot[];

    // async getSeedSlots(): Promise<SeedSlot[]> {
    //     return SeedSlot.store.query().index(commonConfig.DB_SCHEMA.SeedSlot.indexes.byHeat.indexName).wherePartitionKey(this.id).execFetchAll();
    // }

    // @Field(() => SeedSlotList)
    // protected async seedSlots(): Promise<SeedSlotList> {
    //     const list = new SeedSlotList();
    //     list.items = await this.getSeedSlots();
    //     return list;
    // }

    async getRiderAllocations(): Promise<RiderAllocation[]> {
        return RiderAllocation.store
            .query()
            .index(commonConfig.DB_SCHEMA.RiderAllocation.indexes.byAllocatable.indexName)
            .wherePartitionKey(this.id)
            .execFetchAll();
    }

    @Field(() => RiderAllocationList)
    protected async riderAllocations(): Promise<RiderAllocationList> {
        const list = new RiderAllocationList();
        list.items = await this.getRiderAllocations();
        return list;
    }

    async getChildren(): Promise<Creatable[]> {
        // return this.getSeedSlots();
        // Todo: add rider alocations?
        return [];
    }
}
Heat.store = new DynamoStore(Heat);

export default Heat;
