import { handler } from './index';

describe('test lambda a', () => {
    test('successul', async () => {
        const res = await handler({});

        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                success: true,
            }),
        });
    });
});
