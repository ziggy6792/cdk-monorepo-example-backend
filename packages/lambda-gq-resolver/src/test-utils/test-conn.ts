import AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { deleteTables, initMapper, initTables } from '../utils/mapper';

const testConn = async (dropAll = false): Promise<void> => {
  const serviceConfigOptions: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:8000',
  };

  AWS.config.update(serviceConfigOptions);

  initMapper({ region: 'local', tableNamePrefix: 'test-' });

  if (dropAll) {
    await deleteTables();
  }
  await initTables();
};

export default testConn;
