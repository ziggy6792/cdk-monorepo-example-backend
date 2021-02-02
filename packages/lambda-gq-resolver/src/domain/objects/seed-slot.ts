/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import { mapper } from 'src/utils/mapper';
import * as models from 'src/domain/models';
import RiderAllocation from './rider-allocation';
import Heat from './heat';

@ObjectType()
class SeedSlot extends models.SeedSlot {
    @Field()
    position(@Root() parent: SeedSlot): number {
        return parent.getPosition();
    }

    // @Field(() => SeedSlot)
    // async parentSeedSlot(): Promise<SeedSlot> {
    //     return this.getParentSeedSlot();
    // }

    // @Field(() => RiderAllocation)
    // async riderAllocation(): Promise<RiderAllocation> {
    //     return this.getRiderAllocation();
    // }

    // @Field(() => Heat)
    // async heat(): Promise<Heat> {
    //     return this.getHeat();
    // }
}

export default SeedSlot;
