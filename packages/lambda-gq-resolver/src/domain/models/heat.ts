/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, registerEnumType, ID, Int } from 'type-graphql';
import DataEntity from 'src/domain/models/abstract/data-entity';
import { mapper } from 'src/utils/mapper';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { toArray } from 'src/utils/async-iterator';
import { RiderAllocationList, SeedSlotList } from 'src/domain/common-objects/lists';
import { DynamoDB } from 'aws-sdk';

import getEnvConfig from 'src/config/get-env-config';
import Round from './round';
import SeedSlot from './seed-slot';
import RiderAllocation from './rider-allocation';
import Creatable from './abstract/creatable';

const { TABLE_NAME_PREFIX } = getEnvConfig();

export enum HeatStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    FINISHED = 'FINISHED',
}

registerEnumType(HeatStatus, {
    name: 'HeatStatus', // this one is mandatory
    description: 'The Heat Status', // this one is optional
});

@ObjectType()
@table('Heat')
class Heat extends DataEntity {
    @Field()
    @attribute()
    when: string;

    @Field(() => ID)
    @attribute()
    roundId: string;

    @Field(() => HeatStatus)
    @attribute()
    status: HeatStatus;

    @Field(() => Int)
    @attribute()
    progressionsPerHeat: number;

    @Field(() => Round, { name: 'selectedHeat' })
    async getSelectedHeat(): Promise<Round> {
        return mapper.get(Object.assign(new Round(), { id: this.roundId }));
    }

    async getSeedSlots(): Promise<SeedSlot[]> {
        const filter: ConditionExpression = {
            subject: 'heatId',
            ...equals(this.id),
        };
        let items = await toArray(mapper.scan(SeedSlot, { filter }));
        items = _.orderBy(items, ['seed'], ['asc']);

        return items;
    }

    @Field(() => SeedSlotList)
    protected async seedSlots(): Promise<SeedSlotList> {
        const list = new SeedSlotList();
        list.items = await this.getSeedSlots();
        return list;
    }

    async getRiderAllocations(): Promise<RiderAllocation[]> {
        const filter: ConditionExpression = {
            subject: 'allocatableId',
            ...equals(this.id),
        };
        return toArray(mapper.scan(RiderAllocation, { filter }));
    }

    @Field(() => RiderAllocationList)
    protected async riderAllocations(): Promise<RiderAllocationList> {
        const list = new RiderAllocationList();
        list.items = await this.getRiderAllocations();
        return list;
    }

    static async createIndexes(): Promise<void> {
        console.log('RUNNING HEAT CREATE INDEXES!!!!');
        const dynamodb = new DynamoDB();

        await dynamodb
            .updateTable({
                TableName: `${TABLE_NAME_PREFIX}Heat`,
                AttributeDefinitions: [
                    {
                        AttributeName: 'roundId',
                        AttributeType: 'S',
                    },
                    {
                        AttributeName: 'createdAt',
                        AttributeType: 'S',
                    },
                ],
                GlobalSecondaryIndexUpdates: [
                    {
                        Create: {
                            IndexName: 'byRound',
                            KeySchema: [
                                {
                                    AttributeName: 'roundId',
                                    KeyType: 'HASH',
                                },
                                {
                                    AttributeName: 'createdAt',
                                    KeyType: 'RANGE',
                                },
                            ],
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 5,
                                WriteCapacityUnits: 5,
                            },
                            Projection: {
                                ProjectionType: 'ALL',
                            },
                        },
                    },
                ],
            })
            .promise();

        //
    }

    async getChildren(): Promise<Creatable[]> {
        return this.getSeedSlots();
    }
}

export default Heat;
