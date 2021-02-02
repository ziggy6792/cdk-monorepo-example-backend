/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Float } from 'type-graphql';
import Creatable from 'src/domain/models/abstract/creatable';
import { mapper } from 'src/utils/mapper';
import User from './user';

@ObjectType()
class Run {
    @Field(() => Float)
    @attribute()
    score: number;

    @Field()
    @attribute()
    isPublic: boolean;
}

@ObjectType({ isAbstract: true })
@table('RiderAllocation')
class RiderAllocation extends Creatable {
    @Field(() => ID)
    @hashKey()
    allocatableId: string;

    @Field(() => ID)
    @rangeKey()
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
    position(@Root() parent: RiderAllocation): number {
        return parent.getPosition();
    }

    getPosition(): number {
        return 1;
    }

    @Field(() => User)
    async getUser(): Promise<User> {
        return mapper.get(Object.assign(new User(), { id: this.userId }));
    }
}

export default RiderAllocation;

//   position: Int
//   allocatedTo: Allocatable @function(name: "gqResolver-${env}")
