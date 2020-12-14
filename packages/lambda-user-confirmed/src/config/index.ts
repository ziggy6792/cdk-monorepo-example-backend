import SSM from 'aws-sdk/clients/ssm';

export interface IConfig {
  GRAPHQL_API_URL: string;
}

const DEFAULT_CONFIG: IConfig = {
  GRAPHQL_API_URL: '',
};

// eslint-disable-next-line import/no-mutable-exports
export let CONFIG: IConfig = DEFAULT_CONFIG;

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
    CONFIG = await fetchConfig(configPath);
    isFetched = true;
  }
};

export default loadConfig;
