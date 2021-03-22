import mockEvent from './mock-event';

/* eslint-disable max-len */
export const buildIamAuthorizedEvent = (identity: any) => {
    const event = mockEvent;
    event.requestContext.identity = identity;
    return event;
};

/* eslint-disable max-len */
export const buildCognitoAuthorizedEvent = (identity: any) => {
    const event = mockEvent;

    event.requestContext.authorizer = {
        claims: identity,
    };

    event.requestContext = { ...event.requestContext };

    return event;
};
