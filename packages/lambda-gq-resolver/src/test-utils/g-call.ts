/* eslint-disable import/prefer-default-export */
import { ExecutionResult, graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { IContext, IdentityType } from 'src/types';
import createSchema from 'src/typegraphql-setup/create-schema';

interface IOptions {
    source: string;
    variableValues?: Maybe<{ [key: string]: any }>;
}

export const gCall = async ({ source, variableValues }: IOptions): Promise<ExecutionResult> =>
    graphql({
        schema: createSchema(),
        source,
        variableValues,
        contextValue: { req: null, identity: { type: IdentityType.ROLE } } as IContext,
    });
