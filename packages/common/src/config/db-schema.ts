/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { applyDefaults, createGSI, createTableSchema } from './db-schema-helper';
import { IAttributeType } from './types';

const DB_SCHEMA_CONFIG = {
    User: createTableSchema({}),
    SeedSlot: createTableSchema({
        globalSecondaryIndexes: {
            byHeat: createGSI({
                partitionKey: { name: 'heatId', type: IAttributeType.STRING },
                sortKey: { name: 'seed', type: IAttributeType.NUMBER },
            }),
        },
    }),
    Round: createTableSchema({
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
        globalSecondaryIndexes: {
            byRound: createGSI({
                partitionKey: { name: 'roundId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    Event: createTableSchema({}),
    Competition: createTableSchema({
        globalSecondaryIndexes: {
            byEvent: createGSI({
                partitionKey: { name: 'eventId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    ScheduleItem: createTableSchema({}),
};

export const DB_SCHEMA = applyDefaults(DB_SCHEMA_CONFIG);

console.log(DB_SCHEMA_CONFIG.RiderAllocation.tableName);
console.log(DB_SCHEMA_CONFIG.Competition.globalSecondaryIndexes.byEvent);
