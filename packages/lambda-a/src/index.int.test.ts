import absoluteImport from '@example/example';
import aliasImport from 'src/example/example';
import relativeImport from './example/example';
import { handler } from './index';

describe('test lambda a', () => {
  test('successul', async () => {
    const res = await handler({});
    absoluteImport();
    aliasImport();
    relativeImport();
    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    });
  });
});
