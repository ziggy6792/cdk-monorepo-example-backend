import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import RegisterResolver from 'src/modules/user/register';
import GetMeResolver from 'src/modules/user/get-me';
import GetUserResolver from 'src/modules/user/get-user';
import CreateUserResolver from 'src/modules/user/create-user';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
    resolvers: [RegisterResolver, CreateUserResolver, GetMeResolver, GetUserResolver],
});

const createSchema = (): GraphQLSchema => {
    console.log('return schema');
    return schema;
};

export default createSchema;
