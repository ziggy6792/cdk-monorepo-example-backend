import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import UserResolvers from 'src/modules/user/resolvers';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
    resolvers: [...UserResolvers] as any,
});

const createSchema = (): GraphQLSchema => {
    console.log('return schema');
    return schema;
};

export default createSchema;
