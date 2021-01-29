/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, ClassType, InputType, Field, UseMiddleware } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import isAuthRole from 'src/modules/middleware/is-auth-role';
import { createUniqueCondition, mapper } from 'src/utils/mapper';

function createCreateResolver<T extends ClassType, X extends ClassType>(suffix: string, returnType: T, inputType: X, middleware?: Middleware<any>[]) {
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

    return BaseResolver as any;
}

export default createCreateResolver;
