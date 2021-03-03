/* eslint-disable class-methods-use-this */

import { mapper } from 'src/utils/mapper';
import _ from 'lodash';
import { IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import Heat from 'src/domain/models/heat';
import { ScorRunInput } from 'src/modules/score-run/inputs';
import { AuthCheck } from './types';

const isHeatJudge: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const input = args.input as ScorRunInput;

    const heatId = input.allocatableId;

    const heat = await mapper.get(Object.assign(new Heat(), { id: heatId }));
    const round = await heat.getRound();
    const competition = await round.getCompetition();
    if (await competition.isUserAllowedToJudge(identity.user?.username)) {
        return true;
    }

    throw new Error(errorMessage.auth.notCompetitionJudge);
};

export default isHeatJudge;
