import { handler } from './index';
import mockEvent from './mock-event';

describe('test lambda-config-frontend', () => {
    test('successul', async () => {
        process.env.SSM_FRONTEND_CONFIG = '/cdk-monorepo-backend/staging/frontend-config';
        process.env.SSM_FRONTEND_URL = '/cdk-monorepo-frontend/staging/url';

        const res = await handler(mockEvent);

        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                success: true,
            }),
        });
    });
});
