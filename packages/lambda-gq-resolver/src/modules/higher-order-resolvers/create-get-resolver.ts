/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Arg, UseMiddleware, ID, Query } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';

function createGetResolver(suffix: string, returnType: any, middleware?: Middleware<any>[]) {
    class BaseResolver {
        @Query(() => returnType, { name: `get${suffix}` })
        @UseMiddleware(...(middleware || []))
        async list(@Arg('id', () => ID) id: string): Promise<any[]> {
            const entity = Object.assign(new returnType(), { id });
            const ret = mapper.get(entity);
            return ret;
        }
    }

    return BaseResolver as any;
}

export default createGetResolver;
