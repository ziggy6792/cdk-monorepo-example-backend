/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { Resolver, Query, buildSchemaSync } from 'type-graphql';
import RegisterResolver from '../modules/user/Register';

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace NodeJS {
//     interface Global {
//       schema: GraphQLSchema;
//     }
//   }
// }

// global.schema =
//   global.schema ||
//   buildSchemaSync({
//     resolvers: [RegisterResolver],
//   });

console.log('buildSchemaSync');
const schema = buildSchemaSync({
  resolvers: [RegisterResolver],
});

const createSchema = (): GraphQLSchema => {
  console.log('return schema');
  return schema;
};

export default createSchema;
