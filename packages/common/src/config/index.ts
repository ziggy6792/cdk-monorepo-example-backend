/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { IDbSchema, IAttributeType } from './types';

const idPartitionKey = { name: 'id', tpye: IAttributeType.STRING };

const applyDefaults = (schema: IDbSchema) => {
    for (const [key, tableSchema] of Object.entries(schema)) {
        tableSchema.tableName = tableSchema.tableName || key;
        tableSchema.partitionKey = tableSchema.partitionKey || idPartitionKey;
    }
    return schema;
};

const DB_SCHEMA: IDbSchema = applyDefaults({
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
});

const PROJECT_NAME = 'cdk-monorepo-backend';

export default { DB_SCHEMA, PROJECT_NAME };
