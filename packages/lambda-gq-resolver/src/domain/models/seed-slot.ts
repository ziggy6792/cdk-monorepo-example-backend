/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import { mapper } from 'src/utils/mapper';
import RiderAllocation from './rider-allocation';
import Heat from './heat';

@ObjectType()
@table('SeedSlot')
class SeedSlot extends Identifiable {
    @Field(() => ID)
    @attribute()
    heatId: string;

    @Field(() => ID)
    @attribute()
    userId: string;

    @Field(() => Int)
    @attribute()
    seed: number;

    @Field()
    position(@Root() parent: SeedSlot): number {
        return parent.getPosition();
    }

    @Field(() => ID)
    @attribute()
    parentSeedSlotId: string;

    @Field(() => SeedSlot)
    async parentSeedSlot(): Promise<SeedSlot> {
        return mapper.get(Object.assign(new SeedSlot(), { id: this.parentSeedSlotId }));
    }

    @Field(() => RiderAllocation)
    async riderAllocation(): Promise<RiderAllocation> {
        return mapper.get(Object.assign(new RiderAllocation(), { allocatableId: this.heatId, userId: this.userId }));
    }

    @Field(() => Heat)
    async heat(): Promise<Heat> {
        return mapper.get(Object.assign(new Heat(), { id: this.heatId }));
    }

    private getPosition(): number {
        return 1;
    }
}

export default SeedSlot;
