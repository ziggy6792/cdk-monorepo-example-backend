const errorMessage = {
    auth: {
        notAuthenticated: 'not authenticated',
        noUserId: 'No userid or user context given',
        authTypeNotUser: 'No userid or user context given',
        notCompetitionAdmin: 'You are not the competition event admin',
        notCompetitionJudge: 'You are not a competition judge or event admin',
        notEventAdmin: 'You are not the event admin',
        notYou: 'You are not allowed to update other users',
    },
    //
    canNotFindRound1: 'Can not find round 1',
    canNotFindRider: 'The rider you are trying to score is not in this heat',
};

export default errorMessage;
