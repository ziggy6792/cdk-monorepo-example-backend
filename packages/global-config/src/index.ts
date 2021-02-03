/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
enum IAttributeType {
    BINARY = 'B',
    NUMBER = 'N',
    STRING = 'S',
}

interface IAttribute {
    tpye: IAttributeType;
    name: string;
}

interface IGlobalSecondaryIndex {
    indexName: string;
    partitionKey: IAttribute;
    sortKey: IAttribute;
}

interface TableSchema {
    tableName?: string;
    partitionKey?: IAttribute;
    sortKey?: IAttribute;
    globalSecondaryIndexes?: IGlobalSecondaryIndex[];
}

interface IDbSchema {
    [key: string]: TableSchema;
}

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

const getTableName = (tableName: string, stage?: string): string => {
    const contItems = [PROJECT_NAME, stage, tableName].filter((v) => v != null);
    return contItems.join('-');
};

export { DB_SCHEMA, IAttributeType, PROJECT_NAME, getTableName };
