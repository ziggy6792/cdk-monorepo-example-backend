/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */

import { ITableSchema, IDefaultDbSchema, IAttributeType } from './types';

const idPartitionKey = { name: 'id', tpye: IAttributeType.STRING };

const defaultSchema = {
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

type ICompleteSchema = { readonly [key in keyof typeof defaultSchema]: ITableSchema };

const applyDefaults = <T extends IDefaultDbSchema>(schema: T): ICompleteSchema => {
    const ret = {};

    for (const [key, tableSchema] of Object.entries(schema)) {
        ret[key] = {
            tableName: tableSchema.tableName || key,
            partitionKey: tableSchema.partitionKey || idPartitionKey,
            ...tableSchema,
        };
    }
    return ret as ICompleteSchema;
};

const DB_SCHEMA: ICompleteSchema = applyDefaults(defaultSchema);

const PROJECT_NAME = 'cdk-monorepo-backend';

export default { DB_SCHEMA, PROJECT_NAME };
