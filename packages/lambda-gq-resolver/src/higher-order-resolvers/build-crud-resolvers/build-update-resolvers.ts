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

import { IBuildResolversProps, Multiplicity } from './types';

export function buildUpdateResolvers(buildResolversProps: IBuildResolversProps) {
    const { suffix, returnType, resolverProps, idFields, inputType } = buildResolversProps;

    const updateEntity = async (entity: any) => {
        try {
            const createdEntity = await mapper.update(entity, { condition: createExistsCondition(idFields) });
            return createdEntity;
        } catch (err) {
            const keys = _.pickBy(entity, (value, key) => idFields.includes(key));
            throw mapDbException(err, `${suffix} ${JSON.stringify(keys)} does not exist`);
        }
    };

    const resolvers = resolverProps.map((props) => {
        const { middleware } = props;

        if (props.multiplicityType === Multiplicity.ONE) {
            @Resolver()
            class UpdateOneResolver {
                @Mutation(() => returnType, { name: `update${suffix}` })
                @UseMiddleware(...(middleware || []))
                async update(@Arg('input', () => inputType) input: any) {
                    const entity = Object.assign(new returnType(), input);
                    const createdEntity = updateEntity(entity);
                    return createdEntity;
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
                    const entities = inputs.map((input) => Object.assign(new returnType(), input));
                    const updateFns = entities.map((entity) => async () => updateEntity(entity));
                    const updatedEntities = await Promise.all(updateFns.map((fn) => fn()));
                    return updatedEntities;
                }
            }
            return UpdateManyResolver;
        }
        throw new Error('This can never happen');
    });

    return resolvers;
}
