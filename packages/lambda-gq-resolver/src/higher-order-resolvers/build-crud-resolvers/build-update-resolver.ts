/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, ClassType, UseMiddleware } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import { toArray } from 'src/utils/async-iterator';

// Note that this is really doing an upsert

export function buildUpdateOneResolver(suffix: string, returnType: any, inputType: any, middleware?: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `update${suffix}` })
        @UseMiddleware(...(middleware || []))
        async update(@Arg('input', () => inputType) input: any) {
            const entity = Object.assign(new returnType(), input);
            const createdEntity = await mapper.update(entity);
            return createdEntity;
        }
    }

    return BaseResolver;
}

export function buildUpdateManyResolver(suffix: string, returnType: any, inputType: any, middleware?: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => [returnType], { name: `update${pluralize.plural(suffix)}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('inputs', () => [inputType]) inputs: any[]) {
            const entities = inputs.map((input) => Object.assign(new returnType(), input));
            const updateFns = entities.map((entity) => async () => mapper.update(entity, {}));
            const updatedEntities = await Promise.all(updateFns.map((fn) => fn()));
            return updatedEntities;
        }
    }

    return BaseResolver;
}
