import { handler } from './index';
import mockEvent from './mock-event';

describe('test lambda-config-frontend', () => {
    test.skip('successul', async () => {
        process.env.SSM_FRONTEND_CONFIG = '/cdk-monorepo-backend/staging/frontend-config';
        process.env.SSM_FRONTEND_S3BUCKET = '/cdk-monorepo-frontend/staging/s3-bucket';

        const res = await handler(mockEvent);

        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                success: true,
            }),
        });
    });
});
