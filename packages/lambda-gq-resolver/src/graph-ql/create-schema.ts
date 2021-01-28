import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import RegisterResolver from 'src/modules/user/register';
import GetMeResolver from 'src/modules/user/get-me';
import GetUserResolver from 'src/modules/user/get-user';
import { Context } from 'src/types';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
    resolvers: [RegisterResolver, GetMeResolver, GetUserResolver],
    authChecker: ({ context: { identity } }: { context: Context }) => !!identity?.username,
});

const createSchema = (): GraphQLSchema => {
    console.log('return schema');
    return schema;
};

export default createSchema;
