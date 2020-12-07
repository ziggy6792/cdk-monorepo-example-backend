import { ICognitoIdentity } from '../util/verify-jwt';

export interface IEvent {
  identity: ICognitoIdentity;
}

export interface MyContext {
  req: any;
  identity: ICognitoIdentity;
}
