import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import UserResolvers from 'src/modules/user/resolvers';
import EventResolvers from 'src/modules/event/resolvers';
import CompetitionResolvers from 'src/modules/competition/resolvers';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
    resolvers: [...UserResolvers, ...EventResolvers, ...CompetitionResolvers] as any,
});

const createSchema = (): GraphQLSchema => {
    console.log('return schema');
    return schema;
};

export default createSchema;
