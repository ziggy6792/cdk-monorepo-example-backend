/* eslint-disable no-restricted-syntax */
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as utils from 'src/utils';
import { commonConfig, IAttributeType, commonUtils } from '@simonverhoeven/common';

interface DbTablesProps {
    stageName: string;
}
class DbTables extends cdk.Construct {
    // Public reference to the IAM role

    constructor(scope: cdk.Construct, id: string, { stageName }: DbTablesProps) {
        super(scope, id);

        const typeLookup = {
            [IAttributeType.STRING]: dynamodb.AttributeType.STRING,
            [IAttributeType.NUMBER]: dynamodb.AttributeType.NUMBER,
            [IAttributeType.BINARY]: dynamodb.AttributeType.BINARY,
        };

        for (const [key, tableSchema] of Object.entries(commonConfig.DB_SCHEMA)) {
            const { tableName, partitionKey, sortKey, globalSecondaryIndexes } = tableSchema;
            const table = new dynamodb.Table(this, utils.getConstructId(`${tableName}`, stageName), {
                tableName: commonUtils.getTableName(tableName, stageName),
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
