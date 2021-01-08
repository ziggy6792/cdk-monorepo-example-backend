/* eslint-disable import/prefer-default-export */
import { ExecutionResult, graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import createSchema from '../graph-ql/create-schema';

interface IOptions {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

export const gCall = async ({ source, variableValues }: IOptions): Promise<ExecutionResult> => {
  return graphql({
    schema: createSchema(),
    source,
    variableValues,
  });
};
