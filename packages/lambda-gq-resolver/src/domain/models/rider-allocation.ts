/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Float } from 'type-graphql';
import Creatable from 'src/domain/models/abstract/creatable';
import { mapper } from 'src/utils/mapper';
import { commonConfig } from '@alpaca-backend/common';
import * as utils from 'src/utils/utility';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, GSISortKey, Model, PartitionKey, SortKey, Property } from '@shiftcoders/dynamo-easy';
import User from './user';

@ObjectType()
export class Run {
    @Field(() => Float, { nullable: true })
    score: number;

    @Field({ nullable: true })
    isPublic: boolean;
}

@ObjectType()
@Model({ tableName: utils.getTableName(commonConfig.DB_SCHEMA.RiderAllocation.tableName) })
class RiderAllocation extends Creatable {
    static store: DynamoStore<RiderAllocation>;

    @Field(() => ID)
    @PartitionKey()
    allocatableId: string;

    @Field(() => ID)
    @SortKey()
    userId: string;

    @Field(() => Int)
    startSeed: number;

    @Field(() => ID)
    parentSeedSlot: string;

    @Field(() => [Run])
    runs: [Run];

    @Field()
    position(@Root() parent: RiderAllocation): number {
        return parent.getPosition();
    }

    getPosition(): number {
        return 1;
    }

    getBestScore(): number {
        const bestRun = _.maxBy(this.runs, 'score');
        const ret = bestRun ? bestRun.score : -1;
        console.log(`best score ${this.userId} ${ret}`);
        return ret;
    }

    @Field(() => User, { name: 'user' })
    async getUser(): Promise<User> {
        return mapper.get(Object.assign(new User(), { id: this.userId }));
    }
}

RiderAllocation.store = new DynamoStore(RiderAllocation);

export default RiderAllocation;

//   position: Int
//   allocatedTo: Allocatable @function(name: "gqResolver-${env}")
