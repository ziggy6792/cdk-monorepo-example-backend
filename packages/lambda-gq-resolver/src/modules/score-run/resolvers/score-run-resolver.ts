/* eslint-disable class-methods-use-this */

import { Resolver, Mutation, Arg } from 'type-graphql';
import Competition from 'src/domain/models/competition';
import _ from 'lodash';
import Heat from 'src/domain/models/heat';
import { ScorRunInput } from 'src/modules/score-run/inputs/score-run-inputs';

@Resolver()
export default class ScoreRun {
    @Mutation(() => Heat, { nullable: true })
    // @UseMiddleware([createAuthMiddleware([isCompetitionAdmin])])
    async scoreRun(@Arg('input', () => ScorRunInput) input: ScorRunInput): Promise<Competition> {
        console.log('input', JSON.stringify(input));

        return null;
    }
}
