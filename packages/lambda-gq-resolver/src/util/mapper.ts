/* eslint-disable prefer-const */
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DataMapper, ScanIterator } from '@aws/dynamodb-data-mapper';

import User from '../domain-models/User';

// eslint-disable-next-line import/no-mutable-exports
export let mapper: DataMapper;

let isTablesInitialized = false;

// export const getIsTableInitialized = (): boolean => {
//   return isTablesInitialized;
// };

const CREATE_TABLE_ARGS = { readCapacityUnits: 5, writeCapacityUnits: 5 };

export const initMapper = (REGION: string, TABLE_NAME_PREFIX: string): void => {
  mapper = new DataMapper({
    client: new DynamoDB({ region: REGION }), // the SDK client used to execute operations
    tableNamePrefix: TABLE_NAME_PREFIX, // optionally, you can provide a table prefix to keep your dev and prod tables separate
  });
};

export const initTables = async (): Promise<void> => {
  try {
    const timeA = new Date().getTime();
    if (!isTablesInitialized) {
      await mapper.ensureTableExists(User, CREATE_TABLE_ARGS);
    }
    const timeB = new Date().getTime();
    isTablesInitialized = true;
    // console.log(timeB - timeA);
  } catch (err) {
    console.log({ err });
  }
};
