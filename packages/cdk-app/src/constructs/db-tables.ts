/* eslint-disable no-restricted-syntax */
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as utils from 'src/utils';
import { commonConfig, IAttributeType, commonUtils } from '@alpaca-backend/common';
import { ITableSchemaConfig } from '@alpaca-backend/common/dist/config/types';

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

        for (const [_, tableSchema] of Object.entries(commonConfig.DB_SCHEMA)) {
            // tableSchema.
            const { tableName, partitionKey, sortKey, indexes } = tableSchema as ITableSchemaConfig;
            const table = new dynamodb.Table(this, utils.getConstructId(`${tableName}`, stageName), {
                tableName: commonUtils.getTableName(tableName, stageName),
                partitionKey: { name: partitionKey.name, type: typeLookup[partitionKey.type] },
                sortKey: sortKey ? { name: sortKey.name, type: typeLookup[sortKey.type] } : undefined,
                billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            });
            if (indexes) {
                for (const [_, { indexName, partitionKey, sortKey }] of Object.entries(indexes)) {
                    table.addGlobalSecondaryIndex({
                        indexName,
                        partitionKey: { name: partitionKey.name, type: typeLookup[partitionKey.type] },
                        sortKey: { name: sortKey.name, type: typeLookup[sortKey.type] },
                    });
                }
            }

            // indexes?.forEach(({ indexName, partitionKey, sortKey }) => {
            //     table.addGlobalSecondaryIndex({
            //         indexName,
            //         partitionKey: { name: partitionKey.name, type: typeLookup[partitionKey.type] },
            //         sortKey: { name: sortKey.name, type: typeLookup[sortKey.type] },
            //     });
            // });
        }
    }
}

export default DbTables;
