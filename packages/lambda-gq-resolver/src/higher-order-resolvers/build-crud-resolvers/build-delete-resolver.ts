/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Arg, UseMiddleware, ID, Mutation, Resolver } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import { toArray } from 'src/utils/async-iterator';

export function buildDeleteOneResolver(suffix: string, returnType: any, middleware?: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `delete${suffix}` })
        @UseMiddleware(...(middleware || []))
        async delete(@Arg('id', () => ID) id: string): Promise<any[]> {
            const entity = Object.assign(new returnType(), { id });
            const ret = await mapper.delete(entity);
            return ret;
        }
    }

    return BaseResolver;
}

export function buildDeleteManyResolver(suffix: string, returnType: any, inputType: any, middleware?: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => [returnType], { name: `create${pluralize.plural(suffix)}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('inputs', () => [inputType]) inputs: any[]) {
            const entities = inputs.map((input) => Object.assign(new returnType(), input));

            const deletedEntities = toArray(mapper.batchDelete(entities));
            return deletedEntities;
        }
    }

    return BaseResolver;
}
