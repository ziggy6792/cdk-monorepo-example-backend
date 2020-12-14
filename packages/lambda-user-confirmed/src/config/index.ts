import SSM from 'aws-sdk/clients/ssm';

export interface IConfig {
  GRAPHQL_API_URL: string;
}

// eslint-disable-next-line import/no-mutable-exports
export let CONFIG: IConfig;

const getParameterName = (paramPath: string) => paramPath.split('/').pop();

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
  CONFIG = CONFIG || (await fetchConfig(configPath));
};

export default loadConfig;
