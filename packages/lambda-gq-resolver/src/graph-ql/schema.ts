/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { Resolver, Query, buildSchemaSync } from 'type-graphql';
import RegisterResolver from '../modules/user/register';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      schema: GraphQLSchema;
    }
  }
}

global.schema =
  global.schema ||
  buildSchemaSync({
    resolvers: [RegisterResolver],
  });

const { schema } = global;

// const exported = {
//   schema,
//   introspection: true,
//   playground: true,
//   context: async () => {
//     console.log('create');
//     await initTables();
//   },
// };

export default schema;
