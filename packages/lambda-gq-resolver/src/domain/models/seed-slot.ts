/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Ctx } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import { mapper } from 'src/utils/mapper';
import * as utils from 'src/utils/utility';
import { commonConfig } from '@alpaca-backend/common';
import { IContext } from 'src/types';
import RiderAllocation from './rider-allocation';
import Heat from './heat';

@ObjectType()
@table(utils.getTableName(commonConfig.DB_SCHEMA.SeedSlot.tableName))
class SeedSlot extends Identifiable {
    @Field(() => ID)
    @attribute()
    heatId: string;

    @Field(() => ID, { nullable: true })
    @attribute()
    userId: string;

    @Field(() => Int)
    @attribute()
    seed: number;

    @Field(() => Int, { name: 'position', nullable: true })
    async getPosition(@Root() parent: SeedSlot, @Ctx() context: IContext): Promise<number | null> {
        const result = await context.dataLoaders.seedSlotPosition.load(parent.id);
        return result;
    }

    @Field(() => ID, { nullable: true })
    @attribute()
    parentSeedSlotId: string;

    @Field(() => SeedSlot, { nullable: true, name: 'parentSeedSlot' })
    async getParentSeedSlot(): Promise<SeedSlot> {
        if (!this.parentSeedSlotId) {
            return null;
        }
        return mapper.get(Object.assign(new SeedSlot(), { id: this.parentSeedSlotId }));
    }

    @Field(() => RiderAllocation, { name: 'riderAllocation', nullable: true })
    async getRiderAllocation(): Promise<RiderAllocation | null> {
        if (!this.heatId || !this.userId) {
            return null;
        }
        return mapper.get(Object.assign(new RiderAllocation(), { allocatableId: this.heatId, userId: this.userId }));
    }

    @Field(() => Heat, { name: 'heat' })
    async getHeat(): Promise<Heat> {
        return mapper.get(Object.assign(new Heat(), { id: this.heatId }));
    }

    // private getPosition(): number {
    //     return 1;
    // }
}

export default SeedSlot;
