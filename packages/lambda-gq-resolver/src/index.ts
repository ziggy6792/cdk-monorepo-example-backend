import 'source-map-support/register';
import { commonFunctionExample } from '@danielblignaut/common-lambda-lib/dist/utils';

export const handler = async (event: any): Promise<any> => {
  return {
    statusCode: 200,
    body: 'hello from lambda-gq-resolver',
  };
};
