/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, ClassType, UseMiddleware } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import { toArray } from 'src/utils/async-iterator';
import pluralize from 'pluralize';

export function buildCreateOneResolver(suffix: string, returnType: any, inputType: any, middleware?: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `create${suffix}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('input', () => inputType) input: any) {
            const entity = Object.assign(new returnType(), input);
            const createdEntity = await mapper.put(entity, { condition: createUniqueCondition() });
            return createdEntity;
        }
    }

    return BaseResolver;
}

export function buildCreateManyResolver(suffix: string, returnType: any, inputType: any, middleware?: Middleware<any>[]) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => [returnType], { name: `create${pluralize.plural(suffix)}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('inputs', () => [inputType]) inputs: any[]) {
            const entities = inputs.map((input) => Object.assign(new returnType(), input));

            const createdEnties = toArray(mapper.batchPut(entities));
            return createdEnties;
        }
    }

    return BaseResolver;
}
