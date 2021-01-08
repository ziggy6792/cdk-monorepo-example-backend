import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import RegisterResolver from '../modules/user/register/Register';

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
