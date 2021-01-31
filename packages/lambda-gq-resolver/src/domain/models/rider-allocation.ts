/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Float } from 'type-graphql';
import Creatable from 'src/domain/abstract-models/creatable';

@ObjectType()
class Run {
    @Field(() => Float)
    @attribute()
    score: number;

    @Field()
    @attribute()
    isPublic: boolean;
}

@ObjectType()
@table('SeedSlot')
class SeedSlot extends Creatable {
    @Field(() => ID)
    @attribute()
    allocatableId: string;

    @Field(() => ID)
    @attribute()
    userId: string;

    @Field(() => Int)
    @attribute()
    startSeed: number;

    @Field(() => ID)
    @attribute()
    parentSeedSlot: string;

    @Field(() => [Run])
    @attribute()
    runs: [Run];

    @Field()
    position(@Root() parent: SeedSlot): number {
        return parent.getPosition();
    }

    private getPosition(): number {
        return 1;
    }
}

export default SeedSlot;

//   runs: [Run]
//   position: Int
//   user: User @connection(fields: ["userId"])
//   allocatedTo: Allocatable @function(name: "gqResolver-${env}")
