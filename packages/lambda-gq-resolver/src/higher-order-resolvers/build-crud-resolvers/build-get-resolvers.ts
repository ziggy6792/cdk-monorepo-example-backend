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
import { IBuildResolverProps, Multiplicity } from './types';

const buildGetResolvers = (buildResolversProps: IBuildResolverProps) => {
    const retResolvers = [];

    const { suffix, returnType, resolversToBuild } = buildResolversProps;

    const resolvers = resolversToBuild.map((props) => {
        const { middleware } = props;

        if (props.multiplicityType === Multiplicity.ONE) {
            @Resolver()
            class GetOneResolver {
                @Query(() => returnType, { name: `get${suffix}` })
                @UseMiddleware(...(middleware || []))
                async get(@Arg('id', () => ID) id: string): Promise<any[]> {
                    const entity = await returnType.store.get(id).exec();
                    return entity;
                }
            }
            return GetOneResolver;
        }
        if (props.multiplicityType === Multiplicity.MANY) {
            @Resolver()
            class GetManyResolver {
                @Query(() => [returnType], { name: `list${pluralize.plural(suffix)}` })
                @UseMiddleware(...(middleware || []))
                async list(@Arg('limit', () => Int, { nullable: true }) limit: number): Promise<any[]> {
                    const list = await returnType.store.scan().exec();
                    return list.slice(0, limit);
                }
            }
            retResolvers.push(GetManyResolver);
            return GetManyResolver;
        }
        throw new Error('This can never happen');
    });

    return resolvers;
};

export default buildGetResolvers;
