import { DynamoDB } from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';

const { awsConfig } = getEnvConfig();

const dynamoDB = new DynamoDB(awsConfig);

export default dynamoDB;
