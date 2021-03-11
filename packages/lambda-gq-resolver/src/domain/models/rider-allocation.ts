/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int, Root, Float } from 'type-graphql';
import Creatable from 'src/domain/models/abstract/creatable';
import { commonConfig } from '@alpaca-backend/common';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import User from './user';

@ObjectType()
export class Run {
    @Field(() => Float, { nullable: true })
    score: number;

    @Field({ nullable: true })
    isPublic: boolean;
}

const tableSchema = commonConfig.DB_SCHEMA.RiderAllocation;

@ObjectType()
@Model({ tableName: tableSchema.tableName })
class RiderAllocation extends Creatable {
    static store: DynamoStore<RiderAllocation>;

    @Field(() => ID)
    @PartitionKey()
    @GSIPartitionKey(tableSchema.indexes.byAllocatable.indexName)
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
        return User.store.get(this.userId).exec();
    }
}

RiderAllocation.store = new DynamoStore(RiderAllocation);

export default RiderAllocation;

//   position: Int
//   allocatedTo: Allocatable @function(name: "gqResolver-${env}")
