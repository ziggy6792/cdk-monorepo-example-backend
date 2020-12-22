/* eslint-disable camelcase */
import SSM from 'aws-sdk/clients/ssm';

export interface IConfig {
  aws_graphqlEndpoint_authRole: string;
}

const default_config: IConfig = {
  aws_graphqlEndpoint_authRole: '',
};

// eslint-disable-next-line import/no-mutable-exports
export let config: IConfig = default_config;

const getParameterName = (paramPath: string) => paramPath.split('/').pop();

let isFetched = false;

const fetchConfig = async (configPath: string): Promise<IConfig> => {
  const ssm = new SSM();
  const params = await ssm.getParametersByPath({ Path: configPath, Recursive: true }).promise();

  const retConfig: Partial<IConfig> = {};

  console.log('params', params);
  params.Parameters.forEach((parameter) => {
    retConfig[getParameterName(parameter.Name)] = parameter.Value;
  });
  return retConfig as IConfig;
};

const loadConfig = async (configPath: string): Promise<void> => {
  if (!configPath) {
    return;
  }
  if (!isFetched) {
    config = await fetchConfig(configPath);
    isFetched = true;
  }
};

export default loadConfig;
