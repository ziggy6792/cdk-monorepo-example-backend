/* eslint-disable import/no-extraneous-dependencies */
import Axios from 'axios';
import { IJwk } from '../verify-jwt';

const getJwk = async (poolRegion: string, poolId: string): Promise<IJwk> => {
  console.log('Fetch JWK');
  const axios = Axios.create({
    baseURL: `https://cognito-idp.${poolRegion}.amazonaws.com/${poolId}/.well-known/jwks.json`,
  });
  const result = await axios.get('/');
  return result.data as IJwk;
};
export default getJwk;
