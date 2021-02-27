/* eslint-disable no-await-in-loop */
import { MiddlewareFn, ResolverData } from 'type-graphql';
import { IContext } from 'src/types';
import errorMessage from 'src/config/error-message';

export type AuthCheck = (action: ResolverData<IContext>) => Promise<boolean>;
