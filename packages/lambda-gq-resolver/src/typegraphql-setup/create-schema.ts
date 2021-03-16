import 'reflect-metadata';
import { GraphQLSchema } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import UserResolvers from 'src/resolvers/crud/user';
import EventResolvers from 'src/resolvers/crud/event';
import CompetitionResolvers from 'src/resolvers/crud/competition';
import HeatResolvers from 'src/resolvers/crud/heat';
import RoundResolvers from 'src/resolvers/crud/round';
import RiderAllocationResolvers from 'src/resolvers/crud/rider-allocation';
import GetDataEntityResolver from 'src/resolvers/get-data-entity';
import BuildCompetition from 'src/resolvers/build-competition';
import SelectHeat from 'src/resolvers/select-heat';
import AllocateRiders from 'src/resolvers/allocate-riders';
import ScoreRun from 'src/resolvers/score-run';
import HelloResolver from 'src/resolvers/hello-world';
import EndHeatResolver from 'src/resolvers/end-heat';

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
        EndHeatResolver,
        HelloResolver,
    ] as any,
});

const createSchema = (): GraphQLSchema => schema;

export default createSchema;
