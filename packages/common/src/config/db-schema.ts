/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { IDbSchemaConfig, IAttributeType, ITableSchema, IGlobalSecondaryIndex } from './types';

const idPartitionKey = { name: 'id', type: IAttributeType.STRING };

const createGSI = (indexProps: IGlobalSecondaryIndex) => ({
    indexName: indexProps.indexName,
    partitionKey: indexProps.partitionKey,
    sortKey: indexProps.sortKey,
});

const DB_SCHEMA_CONFIG = {
    User: { partitionKey: idPartitionKey },
    SeedSlot: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byHeat: createGSI({
                partitionKey: { name: 'heatId', type: IAttributeType.STRING },
                sortKey: { name: 'seed', type: IAttributeType.NUMBER },
            }),
        },
    },
    Round: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byCompetition: createGSI({
                partitionKey: { name: 'competitionId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    },
    RiderAllocation: {
        partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
        sortKey: { name: 'userId', type: IAttributeType.STRING },
        globalSecondaryIndexes: {
            byAllocatable: createGSI({
                partitionKey: { name: 'allocatableId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    },
    Heat: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byRound: createGSI({
                partitionKey: { name: 'roundId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    },
    Event: { partitionKey: idPartitionKey },
    Competition: {
        partitionKey: idPartitionKey,
        globalSecondaryIndexes: {
            byEvent: createGSI({
                partitionKey: { name: 'eventId', type: IAttributeType.STRING },
                sortKey: { name: 'createdAt', type: IAttributeType.STRING },
            }),
        },
    },
    ScheduleItem: { partitionKey: idPartitionKey },
};

// type IDbSchema = {
//     readonly [tableKey in keyof typeof DB_SCHEMA_CONFIG]: {
//         [indexKey in keyof typeof DB_SCHEMA_CONFIG[tableKey]]: typeof DB_SCHEMA_CONFIG[tableKey][indexKey] & {
//             indexName: string;
//         };
//     } & {
//         tableName: string;
//     };
// };

// type IDbSchema = { readonly [key in keyof typeof DB_SCHEMA_CONFIG]: ITableSchema };

type IDbSchema = {
    readonly [tableKey in keyof typeof DB_SCHEMA_CONFIG]: typeof DB_SCHEMA_CONFIG[tableKey] & ITableSchema;
};

// type IDbSchema = {
//     readonly [tableKey in keyof typeof DB_SCHEMA_CONFIG]: typeof DB_SCHEMA_CONFIG[tableKey] & {
//         tableName: string;
//     };
// };

// type IDbSchema = {
//     readonly [tableKey in keyof typeof DB_SCHEMA_CONFIG]: {
//         [indexKey in keyof typeof DB_SCHEMA_CONFIG[tableKey].globalSecondaryIndexes]: typeof DB_SCHEMA_CONFIG[tableKey].globalSecondaryIndexes]
//     } & {
//         tableName: string;
//     };
// };

// type IDbSchema2 = {
//     readonly [tableKey in keyof typeof DB_SCHEMA_CONFIG]: ITableSchema & { [indexKey in keyof typeof DB_SCHEMA_CONFIG[tableKey]]: IGlobalSecondaryIndex };
// };

const applyDefaults = <T extends IDbSchemaConfig>(schema: T): IDbSchema => {
    const ret: any = {};

    for (const key of Object.keys(schema)) {
        const tableSchema = schema[key];

        if (tableSchema.globalSecondaryIndexes) {
            for (const key of Object.keys(tableSchema.globalSecondaryIndexes)) {
                const gsi = tableSchema.globalSecondaryIndexes[key];
                gsi.indexName = gsi.indexName || key;
            }
        }

        ret[key] = {
            ...tableSchema,
            tableName: tableSchema.tableName || key,
            partitionKey: tableSchema.partitionKey || idPartitionKey,
        };
    }
    return ret as IDbSchema;
};

// DB_SCHEMA_CONFIG.SeedSlot.globalSecondaryIndexes.byHeat

export const DB_SCHEMA = applyDefaults(DB_SCHEMA_CONFIG);

console.log(DB_SCHEMA.Competition.globalSecondaryIndexes.byEvent);
console.log(DB_SCHEMA.Competition.globalSecondaryIndexes.byEvent);

// const tableSchema = DB_SCHEMA.RiderAllocation;

// DB_SCHEMA.SeedSlot.tableName

// DB_SCHEMA.Heat.tabl
