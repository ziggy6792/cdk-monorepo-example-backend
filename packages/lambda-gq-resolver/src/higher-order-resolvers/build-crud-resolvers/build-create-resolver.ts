/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { createNotExistsCondition, mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import _ from 'lodash';

const createEntity = async (entityType: string, entity: any, idFields: string[]) => {
    try {
        const createdEntity = await mapper.put(entity, { condition: createNotExistsCondition(idFields) });
        return createdEntity;
    } catch (err) {
        if (err?.code === 'ConditionalCheckFailedException') {
            const keys = _.pickBy(entity, (value, key) => idFields.includes(key));
            throw new Error(`${entityType} ${JSON.stringify(keys)} already exists`);
        }
        throw err;
    }
};

export function buildCreateOneResolver(suffix: string, returnType: any, inputType: any, idFields: string[], middleware: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `create${suffix}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('input', () => inputType) input: any) {
            const entity = Object.assign(new returnType(), input);
            const createdEntity = await createEntity(suffix, entity, idFields);
            return createdEntity;
        }
    }

    return BaseResolver;
}

export function buildCreateManyResolver(suffix: string, returnType: any, inputType: any, idFields: string[], middleware: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => [returnType], { name: `create${pluralize.plural(suffix)}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('inputs', () => [inputType]) inputs: any[]) {
            const entities = inputs.map((input) => Object.assign(new returnType(), input));
            const createFns = entities.map((entity) => async () => createEntity(suffix, entity, idFields));
            const createdEnties = await Promise.all(createFns.map((fn) => fn()));
            return createdEnties;
        }
    }

    return BaseResolver;
}
