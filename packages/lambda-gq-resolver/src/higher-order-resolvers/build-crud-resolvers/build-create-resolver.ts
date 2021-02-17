/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { createNotExistsCondition, mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import _ from 'lodash';
import { IBuildResolversProps } from './types';

export function buildCreateResolvers(buildResolversProps: IBuildResolversProps) {
    const retResolvers = [];

    console.log('buildResolversProps', buildResolversProps);

    const { suffix, returnType, resolverProps, idFields, inputType } = buildResolversProps;

    const createEntity = async (entity: any) => {
        try {
            const createdEntity = await mapper.put(entity, { condition: createNotExistsCondition(idFields) });
            return createdEntity;
        } catch (err) {
            if (err?.code === 'ConditionalCheckFailedException') {
                const keys = _.pickBy(entity, (value, key) => idFields.includes(key));
                throw new Error(`${suffix} ${JSON.stringify(keys)} already exists`);
            }
            throw err;
        }
    };

    if (resolverProps.one) {
        const oneRsolverProps = resolverProps.one;
        @Resolver()
        class CreateOneResolver {
            @Mutation(() => returnType, { name: `create${suffix}` })
            @UseMiddleware(...(oneRsolverProps.middleware || []))
            async create(@Arg('input', () => inputType) input: any) {
                const entity = Object.assign(new returnType(), input);
                const createdEntity = await createEntity(entity);
                return createdEntity;
            }
        }
        retResolvers.push(CreateOneResolver);
    }

    if (resolverProps.many) {
        const manyResolverProps = resolverProps.one;
        @Resolver()
        class CreateManyResolver {
            @Mutation(() => [returnType], { name: `create${pluralize.plural(suffix)}` })
            @UseMiddleware(...(manyResolverProps.middleware || []))
            async create(@Arg('inputs', () => [inputType]) inputs: any[]) {
                const entities = inputs.map((input) => Object.assign(new returnType(), input));
                const createFns = entities.map((entity) => async () => createEntity(entity));
                const createdEnties = await Promise.all(createFns.map((fn) => fn()));
                return createdEnties;
            }
        }
        retResolvers.push(CreateManyResolver);
    }

    return retResolvers;
}
