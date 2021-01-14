import AWS from 'aws-sdk';
import { initMapper, initTables } from '../utils/mapper';
import clearDb from './clear-db';
import TEST_DB_CONFIG from './config';

const testConn = async ({ drop } = { drop: true }): Promise<void> => {
  AWS.config.update(TEST_DB_CONFIG);

  initMapper({ region: 'local', tableNamePrefix: 'test-' });

  if (drop) {
    await clearDb();
  }
  await initTables();
};

export default testConn;
