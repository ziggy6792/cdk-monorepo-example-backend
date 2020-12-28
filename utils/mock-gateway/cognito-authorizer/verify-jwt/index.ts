/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';

export interface IJwk {
  keys: KeysEntity[];
}
interface KeysEntity {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface ICognitoIdentity {
  sub: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  client_id: string;
  username: string;
}

export interface IDecodedJWT {
  header: IHeader;
  payload: ICognitoIdentity;
  signature: string;
}
export interface IHeader {
  kid: string;
  alg: string;
}

const verifyJwt = (jwk: IJwk, token: string): ICognitoIdentity | null => {
  try {
    const pems = {};
    const { keys } = jwk;
    for (let i = 0; i < keys.length; i++) {
      const keyId = keys[i].kid;
      const modulus = keys[i].n;
      const exponent = keys[i].e;
      const keyType = keys[i].kty;
      const jwk = { kty: keyType, n: modulus, e: exponent };
      const pem = jwkToPem((jwk as unknown) as jwkToPem.JWK);
      pems[keyId] = pem;
    }

    const decodedJwt = jwt.decode(token, { complete: true }) as IDecodedJWT;
    if (!decodedJwt) {
      console.log('Not a valid JWT token');
    } else {
      const { kid } = decodedJwt.header;
      const pem = pems[kid];
      if (!pem) {
        console.log('Invalid token');
      }
      const result = jwt.verify(token, pem);

      return result as ICognitoIdentity;
    }
  } catch (err) {
    console.log('ERROR', err);
  }
  return null;
};

export default verifyJwt;
