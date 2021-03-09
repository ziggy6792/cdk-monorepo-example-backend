/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Arg, UseMiddleware, ID, Mutation, Resolver } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import { toArray } from 'src/utils/async-iterator';
import { IBuildResolverProps, Multiplicity } from './types';

const buildDeleteResolvers = (buildResolversProps: IBuildResolverProps) => {
    const { suffix, returnType, resolversToBuild, idFields, inputType } = buildResolversProps;

    const resolvers = resolversToBuild.map((props) => {
        const { middleware } = props;

        if (props.multiplicityType === Multiplicity.ONE) {
            @Resolver()
            class DeleteOneResolver {
                @Mutation(() => returnType, { name: `delete${suffix}` })
                @UseMiddleware(...(middleware || []))
                async delete(@Arg('id', () => ID) id: string): Promise<any> {
                    const entity = await returnType.store.getAndDelete(id).exec();

                    return entity;
                }
            }
            return DeleteOneResolver;
        }
        if (props.multiplicityType === Multiplicity.MANY) {
            @Resolver()
            class DeleteManyResolver {
                @Mutation(() => [returnType], { name: `delete${pluralize.plural(suffix)}` })
                @UseMiddleware(...(middleware || []))
                async delete(@Arg('input', () => [inputType]) inputs: any[]) {
                    // const entities = inputs.map((input) => Object.assign(new returnType(), input));

                    // const deletedEntities = toArray(mapper.batchDelete(entities));
                    throw new Error('Not implementd');
                    return null;
                }
            }
            return DeleteManyResolver;
        }
        throw new Error('This can never happen');
    });

    return resolvers;
};

export default buildDeleteResolvers;
