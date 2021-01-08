/* eslint-disable prefer-const */
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { FunctionExpression, AttributePath } from '@aws/dynamodb-expressions';

import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import AWS from 'aws-sdk';
import User from '../domain-models/User';

// let serviceConfigOptions: ServiceConfigurationOptions = {
//   region: 'local',
//   endpoint: 'http://localhost:8000',
// };

// AWS.config.update(serviceConfigOptions);

// let dynamodb = new AWS.DynamoDB(serviceConfigOptions);

// let docClient = new AWS.DynamoDB.DocumentClient({
//   region: 'us-west-2',
//   endpoint: 'http://localhost:8000',
// });

// eslint-disable-next-line import/no-mutable-exports
export let mapper: DataMapper;

let isTablesInitialized = false;

// export const getIsTableInitialized = (): boolean => {
//   return isTablesInitialized;
// };

const CREATE_TABLE_ARGS = { readCapacityUnits: 5, writeCapacityUnits: 5 };

interface IInitOptions {
  region: string;
  tableNamePrefix: string;
}

let initOptions: IInitOptions;

export const initMapper = (iOptions: IInitOptions): void => {
  const { region, tableNamePrefix } = iOptions;
  initOptions = iOptions;
  mapper = new DataMapper({
    client: new DynamoDB({ region }), // the SDK client used to execute operations
    tableNamePrefix, // optionally, you can provide a table prefix to keep your dev and prod tables separate
  });
};

const tables = [User];

export const initTables = async (): Promise<void> => {
  try {
    if (!isTablesInitialized) {
      // await mapper.ensureTableExists(User, { ...CREATE_TABLE_ARGS, indexOptions: { email: { projection: { readCapacityUnits: 5 } } } });
      const createTableFunctions = tables.map((table) => mapper.ensureTableExists(table, { ...CREATE_TABLE_ARGS }));
      await Promise.all(createTableFunctions);
    }
    isTablesInitialized = true;
    // console.log(timeB - timeA);
  } catch (err) {
    console.log({ err });
  }
};

export const deleteTables = async (): Promise<void> => {
  if (initOptions.region !== 'local' || !initOptions.tableNamePrefix.includes('test')) {
    throw new Error(`Prevented from deleting database ${JSON.stringify(initOptions)}`);
  }
  try {
    const deleteTableFunctions = tables.map((table) => mapper.ensureTableNotExists(table));
    await Promise.all(deleteTableFunctions);
  } catch (err) {
    console.log({ err });
  }
};

export const createUniqueCondition = (attributePath = 'id'): FunctionExpression =>
  new FunctionExpression('attribute_not_exists', new AttributePath(attributePath));
