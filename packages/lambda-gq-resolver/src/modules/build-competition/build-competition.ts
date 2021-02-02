/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, ID } from 'type-graphql';
import { IContext } from 'src/types';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import isAuthRole from 'src/middleware/is-auth-role';
import Competition from 'src/domain/models/competition';
import { CompetitionParamsInput } from './inputs';

@Resolver()
export default class BuildCompetition {
    @Mutation(() => Competition, { nullable: true })
    // @UseMiddleware(isAuthUser)
    async buildCompetition(
        @Ctx() ctx: IContext,
        @Arg('id', () => ID) id: string,
        @Arg('params', () => CompetitionParamsInput) params: CompetitionParamsInput
    ): Promise<Competition> {
        console.log('Running buildCompetition resolver');
        console.log(id);
        console.log(JSON.stringify(params));
        console.log(params.rounds[0].heats[0].seedSlots[0].seed);

        return null;
    }
}
