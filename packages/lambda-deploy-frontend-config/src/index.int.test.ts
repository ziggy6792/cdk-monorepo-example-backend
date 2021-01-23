import { handler } from './index';
import mockEvent from './mock-event';

describe('test lambda-deploy-frontend-config', () => {
    test('successul', async () => {
        process.env.SSM_FRONTEND_CONFIG = '/cdk-monorepo-backend/staging/frontend-config';
        process.env.SSM_PATH_FRONTEND_DEPLOYMENT = '/cdk-monorepo-frontend/staging';

        const res = await handler(mockEvent);

        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                success: true,
            }),
        });
    });
});
