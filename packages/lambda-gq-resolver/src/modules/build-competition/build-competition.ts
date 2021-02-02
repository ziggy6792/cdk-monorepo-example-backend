/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, ID } from 'type-graphql';
import { IContext } from 'src/types';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import isAuthRole from 'src/middleware/is-auth-role';
import CompetitionModel from 'src/domain/models/competition';
import { CompetitionParamsInput } from './inputs';

@Resolver()
export default class BuildCompetition {
    @Mutation(() => CompetitionModel, { nullable: true })
    // @UseMiddleware(isAuthUser)
    async buildCompetition(
        @Ctx() ctx: IContext,
        @Arg('id', () => ID) id: string,
        @Arg('params', () => CompetitionParamsInput) params: CompetitionParamsInput
    ): Promise<CompetitionModel> {
        const competition = await mapper.get(Object.assign(new CompetitionModel(), { id }));

        const rounnds = await competition.getRounds();

        mapper.batchDelete(rounnds);

        console.log('Running buildCompetition resolver');
        console.log(id);
        console.log(JSON.stringify(params));
        console.log(params.rounds[0].heats[0].seedSlots[0].seed);

        return null;
    }
}
