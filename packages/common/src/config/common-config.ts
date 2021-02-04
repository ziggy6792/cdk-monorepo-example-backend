/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { ITableSchema, IDbSchemaConfig, IAttributeType } from './types';

const idPartitionKey = { name: 'id', tpye: IAttributeType.STRING };

const PROJECT_NAME = 'cdk-monorepo-backend';

const DB_SCHEMA_CONFIG = {
    User: { partitionKey: idPartitionKey },
    SeedSlot: { partitionKey: idPartitionKey },
    Round: { partitionKey: idPartitionKey },
    RiderAllocation: { partitionKey: idPartitionKey, sortKey: { name: 'userId', tpye: IAttributeType.STRING } },
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
    Competition: { partitionKey: idPartitionKey },
};

type IDbSchema = { readonly [key in keyof typeof DB_SCHEMA_CONFIG]: ITableSchema };

const applyDefaults = <T extends IDbSchemaConfig>(schema: T): IDbSchema => {
    const ret = {};

    for (const [key, tableSchema] of Object.entries(schema)) {
        ret[key] = {
            tableName: tableSchema.tableName || key,
            partitionKey: tableSchema.partitionKey || idPartitionKey,
            ...tableSchema,
        };
    }
    return ret as IDbSchema;
};

const DB_SCHEMA = applyDefaults(DB_SCHEMA_CONFIG);

export default { DB_SCHEMA, PROJECT_NAME };
