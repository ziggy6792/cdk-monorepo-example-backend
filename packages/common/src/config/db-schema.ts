/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { applyDefaults, createGSI, createTableSchema } from './db-schema-helper';
import { IAttributeType } from './types';

const idPartitionKey = { name: 'id', type: IAttributeType.STRING };

const DB_SCHEMA_CONFIG = {
    User: createTableSchema({ partitionKey: idPartitionKey }),
    SeedSlot: createTableSchema({
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byHeat: createGSI({
                partitionKey: { name: 'heatId', type: IAttributeType.STRING },
                sortKey: { name: 'seed', type: IAttributeType.NUMBER },
            }),
        },
    }),
    Round: createTableSchema({
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byCompetition: createGSI({
                partitionKey: { name: 'competitionId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    RiderAllocation: createTableSchema({
        partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
        sortKey: { name: 'userId', type: IAttributeType.STRING },
        globalSecondaryIndexes: {
            byAllocatable: createGSI({
                partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    Heat: createTableSchema({
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byRound: createGSI({
                partitionKey: { name: 'roundId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    Event: createTableSchema({ partitionKey: idPartitionKey }),
    Competition: createTableSchema({
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byEvent: createGSI({
                partitionKey: { name: 'eventId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    ScheduleItem: createTableSchema({ partitionKey: idPartitionKey }),
};

// DB_SCHEMA_CONFIG.SeedSlot.globalSecondaryIndexes.byHeat

export const DB_SCHEMA = applyDefaults(DB_SCHEMA_CONFIG);

console.log(DB_SCHEMA.Competition.globalSecondaryIndexes.byEvent);
console.log(DB_SCHEMA.Competition.globalSecondaryIndexes.byEvent);

// const tableSchema = DB_SCHEMA.RiderAllocation;

// DB_SCHEMA.SeedSlot.tableName

// DB_SCHEMA.Heat.tabl
