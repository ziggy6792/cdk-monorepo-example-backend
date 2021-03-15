import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import UserResolvers from 'src/modules/crud/user/resolvers';
import EventResolvers from 'src/modules/crud/event/resolvers';
import CompetitionResolvers from 'src/modules/crud/competition/resolvers';
import HeatResolvers from 'src/modules/crud/heat/resolvers';
import RoundResolvers from 'src/modules/crud/round/resolvers';
import RiderAllocationResolvers from 'src/modules/crud/rider-allocation/resolvers';
import GetDataEntityResolver from 'src/modules/get-data-entity/resolvers';
import BuildCompetition from 'src/modules/build-competition/resolvers';
import SelectHeat from 'src/modules/select-heat/resolvers';
import AllocateRiders from 'src/modules/allocate-riders/resolvers';
import ScoreRun from 'src/modules/score-run/resolvers';
import HelloResolver from 'src/modules/hello-world/resolvers';

const schema = buildSchemaSync({
    resolvers: [
        ...UserResolvers,
        ...EventResolvers,
        ...CompetitionResolvers,
        ...HeatResolvers,
        ...RoundResolvers,
        ...RiderAllocationResolvers,
        GetDataEntityResolver,
        BuildCompetition,
        AllocateRiders,
        ScoreRun,
        SelectHeat,
        HelloResolver,
    ] as any,
});

const createSchema = (): GraphQLSchema => schema;

export default createSchema;
