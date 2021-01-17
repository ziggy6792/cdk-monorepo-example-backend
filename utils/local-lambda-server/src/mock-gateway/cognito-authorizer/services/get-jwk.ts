/* eslint-disable import/no-extraneous-dependencies */
import Axios, { AxiosResponse } from 'axios';
import { IJwk } from 'src/mock-gateway/cognito-authorizer/verify-jwt';

const getJwk = async (poolRegion: string, poolId: string): Promise<IJwk> => {
  console.log('Fetch JWK');
  const axios = Axios.create({
    baseURL: `https://cognito-idp.${poolRegion}.amazonaws.com/${poolId}/.well-known/jwks.json`,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: AxiosResponse<any>;
  try {
    result = await axios.get('/');
  } catch (err) {
    console.log(`Error fetching jwt for pool ${poolId}`);
    return null;
  }
  return result.data as IJwk;
};
export default getJwk;
