/* eslint-disable class-methods-use-this */

import _ from 'lodash';
import { IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import Competition from 'src/domain/models/competition';
import { AuthCheck } from './types';

const isCompetitionAdmin: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const competitionId = args.id as string;

    // const competition = await mapper.get(Object.assign(new Competition(), { id: competitionId }));
    const competition = await Competition.store.get(competitionId).exec();
    const event = await competition.getEvent();
    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.auth.notCompetitionAdmin);
};

export default isCompetitionAdmin;
