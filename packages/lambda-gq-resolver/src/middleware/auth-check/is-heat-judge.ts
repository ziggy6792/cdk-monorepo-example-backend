import { IIdentity, IdentityType } from 'src/types';
/* eslint-disable class-methods-use-this */

import _ from 'lodash';

import errorMessage from 'src/config/error-message';
import Heat from 'src/domain/models/heat';
import { ScorRunInput } from 'src/resolvers/score-run/inputs';
import { AuthCheck } from './types';

const isHeatJudge = async (heatId: string, identity: IIdentity) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const heat = await Heat.store.get(heatId).exec();
    const round = await heat.getRound();
    const competition = await round.getCompetition();
    if (await competition.isUserAllowedToJudge(identity.user?.username)) {
        return true;
    }

    throw new Error(errorMessage.auth.notCompetitionJudge);
};

export const isHeatInputJudge: AuthCheck = async ({ args, context: { identity } }) => {
    const input = args.input as ScorRunInput;
    const { heatId } = input;
    return isHeatJudge(heatId, identity);
};

export const isHeatIdJudge: AuthCheck = async ({ args, context: { identity } }) => {
    const heatId = args.id as string;
    return isHeatJudge(heatId, identity);
};
