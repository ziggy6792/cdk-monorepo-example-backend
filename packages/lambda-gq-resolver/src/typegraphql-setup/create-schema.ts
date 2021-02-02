import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import UserResolvers from 'src/modules/user/resolvers';
import EventResolvers from 'src/modules/event/resolvers';
import CompetitionResolvers from 'src/modules/competition/resolvers';
import HeatResolvers from 'src/modules/heat/resolvers';
import RoundResolvers from 'src/modules/round/resolvers';
import SeedSlotResolvers from 'src/modules/seed-slot/resolvers';
import GetDataEntityResolver from 'src/modules/get-data-entity';
import RegisterResolver from 'src/modules/user/resolvers/register';
import BuildCompetition from 'src/modules/build-competition';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
    resolvers: [
        ...UserResolvers,
        ...EventResolvers,
        ...CompetitionResolvers,
        ...HeatResolvers,
        ...RoundResolvers,
        ...SeedSlotResolvers,
        GetDataEntityResolver,
        RegisterResolver,
        BuildCompetition,
    ] as any,
});

const createSchema = (): GraphQLSchema => {
    console.log('return schema');
    return schema;
};

export default createSchema;
