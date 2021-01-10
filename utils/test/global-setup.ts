// import AWS from 'aws-sdk';
// import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

// const serviceConfigOptions: ServiceConfigurationOptions = {
//   region: 'local',
//   endpoint: 'http://localhost:8000',
// };

// AWS.config.update(serviceConfigOptions);

import { start } from './local-db-util';

const setup = async (): Promise<void> => {
  await start();
};

export default setup;
