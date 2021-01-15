import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import RegisterResolver from 'src/modules/user/register/Register';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
  resolvers: [RegisterResolver],
});

const createSchema = (): GraphQLSchema => {
  console.log('return schema');
  return schema;
};

export default createSchema;
