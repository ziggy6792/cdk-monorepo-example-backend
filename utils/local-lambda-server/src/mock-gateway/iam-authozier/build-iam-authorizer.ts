import { buildIamAuthorizedEvent } from 'src/mock-gateway/build-authd-event';
import { IIamIdentity, ExpressMiddleware } from 'src/mock-gateway/types';
import { lambdaRoleIdentity, unauthenticatedUserPoolIdentity } from 'src/mock-gateway/iam-authozier/iam-identities';

export const buildIamAutorizer = async (): Promise<ExpressMiddleware> =>
    function (req, res, next): void {
        let identity: IIamIdentity = unauthenticatedUserPoolIdentity;
        if (req.headers['lambda-role']) {
            // console.log('using lambda role identity');
            identity = lambdaRoleIdentity;
        }

        const event = buildIamAuthorizedEvent(identity);

        req.headers['x-apigateway-event'] = encodeURIComponent(JSON.stringify(event));

        next();
    };
export default buildIamAutorizer;
