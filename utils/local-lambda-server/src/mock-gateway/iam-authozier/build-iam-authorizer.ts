import buildIamAuthorizedEvent from 'src/mock-gateway/build-authd-event';
import { IIamIdentity, ExpressMiddleware } from 'src/mock-gateway/types';

export const buildIamAutorizer = async (identity: IIamIdentity): Promise<ExpressMiddleware> =>
    function (req, res, next): void {
        console.log('Authorization', req.headers.authorization);

        const event = buildIamAuthorizedEvent(identity);

        req.headers['x-apigateway-event'] = encodeURIComponent(JSON.stringify(event));

        next();
    };
export default buildIamAutorizer;
