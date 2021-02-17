/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, ClassType, UseMiddleware, Int, Query, ID } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';
import { toArray } from 'src/utils/async-iterator';
import pluralize from 'pluralize';
import { IBuildResolversProps } from './types';

export function buildGetResolvers(buildResolversProps: IBuildResolversProps) {
    const retResolvers = [];

    const { suffix, returnType, resolverProps } = buildResolversProps;

    if (resolverProps.one) {
        const { middleware } = resolverProps.one;

        @Resolver()
        class DelteOneResolver {
            @Query(() => returnType, { name: `get${suffix}` })
            @UseMiddleware(...(middleware || []))
            async get(@Arg('id', () => ID) id: string): Promise<any[]> {
                const entity = Object.assign(new returnType(), { id });
                const ret = await mapper.get(entity);
                return ret;
            }
        }

        retResolvers.push(DelteOneResolver);
    }

    if (resolverProps.many) {
        const { middleware } = resolverProps.many;

        @Resolver()
        class CreateManyResolver {
            @Query(() => [returnType], { name: `list${pluralize.plural(suffix)}` })
            @UseMiddleware(...(middleware || []))
            async list(@Arg('limit', () => Int, { nullable: true }) limit: number): Promise<any[]> {
                const list = await toArray(mapper.scan(returnType));
                return list.slice(0, limit);
            }
        }
        retResolvers.push(CreateManyResolver);
    }

    return retResolvers;
}
