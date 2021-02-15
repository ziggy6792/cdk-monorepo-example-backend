/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { ITableSchema, IDbSchemaConfig, IAttributeType } from './types';

const idPartitionKey = { name: 'id', tpye: IAttributeType.STRING };

const DB_SCHEMA_CONFIG = {
    User: { partitionKey: idPartitionKey },
    SeedSlot: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byHeat',
                partitionKey: { name: 'heatId', tpye: IAttributeType.STRING },
                sortKey: { name: 'createdAt', tpye: IAttributeType.STRING },
            },
        ],
    },
    Round: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byCompetition',
                partitionKey: { name: 'competitionId', tpye: IAttributeType.STRING },
                sortKey: { name: 'createdAt', tpye: IAttributeType.STRING },
            },
        ],
    },
    RiderAllocation: {
        partitionKey: { name: 'allocatableId', tpye: IAttributeType.STRING },
        sortKey: { name: 'userId', tpye: IAttributeType.STRING },
        globalSecondaryIndexes: [
            {
                indexName: 'byAllocatable',
                partitionKey: { name: 'allocatableId', tpye: IAttributeType.STRING },
                sortKey: { name: 'createdAt', tpye: IAttributeType.STRING },
            },
        ],
    },
    Heat: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byRound',
                partitionKey: { name: 'roundId', tpye: IAttributeType.STRING },
                sortKey: { name: 'createdAt', tpye: IAttributeType.STRING },
            },
        ],
    },
    Event: { partitionKey: idPartitionKey },
    Competition: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: [
            {
                indexName: 'byEvent',
                partitionKey: { name: 'eventId', tpye: IAttributeType.STRING },
                sortKey: { name: 'createdAt', tpye: IAttributeType.STRING },
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
