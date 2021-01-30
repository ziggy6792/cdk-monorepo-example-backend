/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Arg, UseMiddleware, ID, Mutation } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';

function createDeleteResolver(suffix: string, returnType: any, middleware?: Middleware<any>[]) {
    class BaseResolver {
        @Mutation(() => returnType, { name: `delete${suffix}` })
        @UseMiddleware(...(middleware || []))
        async delete(@Arg('id', () => ID) id: string): Promise<any[]> {
            const entity = Object.assign(new returnType(), { id });
            const ret = mapper.delete(entity);
            return ret;
        }
    }

    return BaseResolver as any;
}

export default createDeleteResolver;
