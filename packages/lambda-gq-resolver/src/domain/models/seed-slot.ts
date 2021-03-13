/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Ctx } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import * as utils from 'src/utils/utility';
import { commonConfig } from '@alpaca-backend/common';
import { IContext } from 'src/types';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, Model } from '@shiftcoders/dynamo-easy';
import RiderAllocation from './rider-allocation';
import Heat from './heat';

const tableSchema = commonConfig.DB_SCHEMA.SeedSlot;

@ObjectType()
@Model({ tableName: utils.getTableName(tableSchema.tableName) })
class SeedSlot extends Identifiable {
    static store: DynamoStore<SeedSlot>;

    @Field(() => ID)
    @GSIPartitionKey(tableSchema.indexes.byHeat.indexName)
    heatId: string;

    @Field(() => ID, { nullable: true })
    userId: string;

    @Field(() => Int)
    seed: number;

    @Field(() => Int, { name: 'position', nullable: true })
    async getPosition(@Root() parent: SeedSlot, @Ctx() context: IContext): Promise<number | null> {
        const result = await context.dataLoaders.seedSlotPosition.load(parent.id);
        return result;
    }

    @Field(() => ID, { nullable: true })
    parentSeedSlotId: string;

    @Field(() => SeedSlot, { nullable: true, name: 'parentSeedSlot' })
    async getParentSeedSlot(): Promise<SeedSlot> {
        if (!this.parentSeedSlotId) {
            return null;
        }
        return SeedSlot.store.get(this.parentSeedSlotId).exec();
    }

    @Field(() => RiderAllocation, { name: 'riderAllocation', nullable: true })
    async getRiderAllocation(): Promise<RiderAllocation | null> {
        if (!this.heatId || !this.userId) {
            return null;
        }
        return RiderAllocation.store.get(this.heatId, this.userId).exec();
    }

    @Field(() => Heat, { name: 'heat' })
    async getHeat(): Promise<Heat> {
        return Heat.store.get(this.heatId).exec();
    }
}

SeedSlot.store = new DynamoStore(SeedSlot);

export default SeedSlot;
