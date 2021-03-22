import mockEvent from './mock-event';

/* eslint-disable max-len */
const buildIamAuthorizedEvent = (identity: any) => {
    const event = mockEvent;

    event.requestContext.authorizer = {
        claims: {
            identity,
        },
    };

    event.requestContext = { ...event.requestContext };

    return event;
};

export default buildIamAuthorizedEvent;
