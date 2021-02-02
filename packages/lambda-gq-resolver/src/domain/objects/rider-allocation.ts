/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Float } from 'type-graphql';
import Creatable from 'src/domain/models/abstract/creatable';
import { mapper } from 'src/utils/mapper';
import * as models from 'src/domain/models';
import User from './user';

@ObjectType()
class RiderAllocation extends models.RiderAllocation {
    @Field()
    position(@Root() parent: RiderAllocation): number {
        return parent.getPosition();
    }

    @Field(() => User)
    async user(): Promise<User> {
        return this.getUser();
    }
}

export default RiderAllocation;

//   position: Int
//   allocatedTo: Allocatable @function(name: "gqResolver-${env}")
