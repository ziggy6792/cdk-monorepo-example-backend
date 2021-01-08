import AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const testConn = async (dropAll = false) => {
  const serviceConfigOptions: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:8000',
  };

  AWS.config.update(serviceConfigOptions);
};

export default testConn;
