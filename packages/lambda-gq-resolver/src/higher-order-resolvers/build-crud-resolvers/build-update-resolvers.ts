/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import { createExistsCondition, mapDbException } from 'src/utils/utility';
import _ from 'lodash';

import { IBuildResolverProps, Multiplicity } from './types';

const buildUpdateResolvers = (buildResolversProps: IBuildResolverProps) => {
    const { suffix, returnType, resolversToBuild, idFields, inputType } = buildResolversProps;

    const updateEntity = async (entity: any) => {
        try {
            const updatedEntity = returnType.store.updateItem(entity).ifExists().returnValues('ALL_NEW');
            return updatedEntity;
        } catch (err) {
            const keys = _.pick(entity, idFields);
            throw mapDbException(err, `${suffix} ${JSON.stringify(keys)} does not exist`);
        }
    };

    const resolvers = resolversToBuild.map((props) => {
        const { middleware } = props;

        if (props.multiplicityType === Multiplicity.ONE) {
            @Resolver()
            class UpdateOneResolver {
                @Mutation(() => returnType, { name: `update${suffix}` })
                @UseMiddleware(...(middleware || []))
                async update(@Arg('input', () => inputType) input: any) {
                    const updatedEntity = updateEntity(input);
                    return updatedEntity;
                }
            }
            return UpdateOneResolver;
        }
        if (props.multiplicityType === Multiplicity.MANY) {
            @Resolver()
            class UpdateManyResolver {
                @Mutation(() => [returnType], { name: `update${pluralize.plural(suffix)}` })
                @UseMiddleware(...(middleware || []))
                async create(@Arg('input', () => [inputType]) inputs: any[]) {
                    const updateFns = inputs.map((input) => async () => updateEntity(input));
                    const updatedEntities = await Promise.all(updateFns.map((fn) => fn()));
                    return updatedEntities;
                }
            }
            return UpdateManyResolver;
        }
        throw new Error('This can never happen');
    });

    return resolvers;
};

export default buildUpdateResolvers;
