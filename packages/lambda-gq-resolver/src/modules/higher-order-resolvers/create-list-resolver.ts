/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, ClassType, UseMiddleware, Int, Query } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';
import { toArray } from 'src/utils/async-iterator';
import pluralize from 'pluralize';

function createListResolver(suffix: string, returnType: any, middleware?: Middleware<any>[]) {
    class BaseResolver {
        @Query(() => [returnType], { name: `list${pluralize.plural(suffix)}` })
        @UseMiddleware(...(middleware || []))
        async list(@Arg('limit', () => Int, { nullable: true }) limit: number): Promise<any[]> {
            const list = await toArray(mapper.scan(returnType));
            return list.slice(0, limit);
        }
    }

    return BaseResolver as any;
}

export default createListResolver;
