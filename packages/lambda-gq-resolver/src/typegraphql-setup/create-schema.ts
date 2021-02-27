import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import UserResolvers from 'src/modules/domain/user/resolvers';
import EventResolvers from 'src/modules/domain/event/resolvers';
import CompetitionResolvers from 'src/modules/domain/competition/resolvers';
import HeatResolvers from 'src/modules/domain/heat/resolvers';
import RoundResolvers from 'src/modules/domain/round/resolvers';
import SeedSlotResolvers from 'src/modules/domain/seed-slot/resolvers';
import RiderAllocationResolvers from 'src/modules/domain/rider-allocation/resolvers';
import GetDataEntityResolver from 'src/modules/get-data-entity/resolvers';
import RegisterResolver from 'src/modules/domain/user/resolvers/register';
import BuildCompetition from 'src/modules/build-competition/resolvers';

console.log('buildSchemaSync');
const schema = buildSchemaSync({
    resolvers: [
        ...UserResolvers,
        ...EventResolvers,
        ...CompetitionResolvers,
        ...HeatResolvers,
        ...RoundResolvers,
        ...SeedSlotResolvers,
        ...RiderAllocationResolvers,
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
