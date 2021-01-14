import mockEvent from './mock-event';

/* eslint-disable max-len */
const buildIamAuthorizedEvent = (identity: any) => {
  const event = mockEvent;
  event.requestContext.identity = identity;
  return event;
};

export default buildIamAuthorizedEvent;
