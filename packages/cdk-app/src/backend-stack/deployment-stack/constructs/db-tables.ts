/* eslint-disable no-restricted-syntax */
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as utils from 'src/utils';

interface DbTablesProps {
    stageName: string;
}

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

const dbSchema: IDbSchema = applyDefaults({
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

class DbTables extends cdk.Construct {
    // Public reference to the IAM role

    constructor(scope: cdk.Construct, id: string, { stageName }: DbTablesProps) {
        super(scope, id);

        const typeLookup = {
            [IAttributeType.STRING]: dynamodb.AttributeType.STRING,
            [IAttributeType.NUMBER]: dynamodb.AttributeType.NUMBER,
            [IAttributeType.BINARY]: dynamodb.AttributeType.BINARY,
        };

        for (const [key, tableSchema] of Object.entries(dbSchema)) {
            const { tableName, partitionKey, sortKey, globalSecondaryIndexes } = tableSchema;
            const table = new dynamodb.Table(this, utils.getConstructId(`${tableName}`, stageName), {
                tableName: utils.getTableName(tableName, stageName),
                partitionKey: { name: partitionKey.name, type: typeLookup[partitionKey.tpye] },
                sortKey: sortKey ? { name: sortKey.name, type: typeLookup[sortKey.tpye] } : undefined,
            });
            globalSecondaryIndexes?.forEach(({ indexName, partitionKey, sortKey }) => {
                table.addGlobalSecondaryIndex({
                    indexName,
                    partitionKey: { name: partitionKey.name, type: typeLookup[partitionKey.tpye] },
                    sortKey: { name: sortKey.name, type: typeLookup[sortKey.tpye] },
                });
            });
        }

        // const tableName = 'MyFirstTable';

        // const table = new dynamodb.Table(this, utils.getConstructId(tableName, stageName), {
        //     partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },

        //     tableName: utils.getTableName(tableName, stageName),
        // });

        // table.addGlobalSecondaryIndex({
        //     indexName: 'byRound',
        //     partitionKey: { name: 'roundId', type: dynamodb.AttributeType.STRING },
        //     sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
        // });

        // table.addGlobalSecondaryIndex({
        //     indexName: 'byRound2',
        //     partitionKey: { name: 'roundId', type: dynamodb.AttributeType.STRING },
        //     sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
        // });

        // table.addGlobalSecondaryIndex({
        //     indexName: 'byRound3',
        //     partitionKey: { name: 'roundId', type: dynamodb.AttributeType.STRING },
        //     sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
        // });

        // for (const [key, value] of Object.entries(dbSchema)) {
        //     console.log(`${key}: ${value}`);
        // }
    }
}

export default DbTables;
