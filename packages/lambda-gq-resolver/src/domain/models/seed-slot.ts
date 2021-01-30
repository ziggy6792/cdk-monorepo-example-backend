/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root } from 'type-graphql';
import BaseModel from 'src/domain/abstract-models/base-model-with-id';

@ObjectType()
@table('SeedSlot')
class SeedSlot extends BaseModel {
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
    parentSeedSlot: string;

    private getPosition(): number {
        return 1;
    }
}

export default SeedSlot;

// parentSeedSlotId: ID!
// parentSeedSlot: SeedSlot @connection(fields: ["parentSeedSlotId"])
// pSeedSlot: SeedSlot @function(name: "dbResolver-${env}")
// riderAllocation: RiderAllocation @connection(fields: ["heatId", "userId"])
// heat: Heat! @connection(fields: ["heatId"])
