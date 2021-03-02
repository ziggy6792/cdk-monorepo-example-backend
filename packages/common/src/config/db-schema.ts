/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { ITableSchema, IDbSchemaConfig, IAttributeType } from './types';

const idPartitionKey = { name: 'id', type: IAttributeType.STRING };

const DB_SCHEMA_CONFIG = {
    User: { partitionKey: idPartitionKey },
    SeedSlot: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byHeat',
                partitionKey: { name: 'heatId', type: IAttributeType.STRING },
                sortKey: { name: 'seed', type: IAttributeType.NUMBER },
            },
        ],
    },
    Round: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byCompetition',
                partitionKey: { name: 'competitionId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            },
        ],
    },
    RiderAllocation: {
        partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
        sortKey: { name: 'userId', type: IAttributeType.STRING },
        globalSecondaryIndexes: [
            {
                indexName: 'byAllocatable',
                partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            },
        ],
    },
    Heat: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byRound',
                partitionKey: { name: 'roundId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            },
        ],
    },
    Event: { partitionKey: idPartitionKey },
    Competition: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byEvent',
                partitionKey: { name: 'eventId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            },
        ],
    },
    ScheduleItem: { partitionKey: idPartitionKey },
};

type IDbSchema = { readonly [key in keyof typeof DB_SCHEMA_CONFIG]: ITableSchema };

const applyDefaults = <T extends IDbSchemaConfig>(schema: T): IDbSchema => {
    const ret: any = {};

    for (const [key, tableSchema] of Object.entries(schema)) {
        ret[key] = {
            tableName: tableSchema.tableName || key,
            partitionKey: tableSchema.partitionKey || idPartitionKey,
            ...tableSchema,
        };
    }
    return ret as IDbSchema;
};

export const DB_SCHEMA = applyDefaults(DB_SCHEMA_CONFIG);
