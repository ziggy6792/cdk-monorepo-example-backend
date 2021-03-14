/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { applyDefaults, createGSI, createTableSchema } from './db-schema-helper';
import { IAttributeType } from './types';

const DB_SCHEMA_CONFIG = {
    User: createTableSchema({}),
    // SeedSlot: createTableSchema({
    //     indexes: {
    //         byHeat: createGSI({
    //             partitionKey: { name: 'heatId', type: IAttributeType.STRING },
    //             sortKey: { name: 'seed', type: IAttributeType.NUMBER },
    //         }),
    //     },
    // }),
    Round: createTableSchema({
        indexes: {
            byCompetition: createGSI({
                partitionKey: { name: 'competitionId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    RiderAllocation: createTableSchema({
        partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
        sortKey: { name: 'userId', type: IAttributeType.STRING },
        indexes: {
            byAllocatable: createGSI({
                partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    Heat: createTableSchema({
        indexes: {
            byRound: createGSI({
                partitionKey: { name: 'roundId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    }),
    Event: createTableSchema({}),
    Competition: createTableSchema({
        indexes: {
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
// console.log(DB_SCHEMA_CONFIG.User.indexes.byEvent.indexName);
