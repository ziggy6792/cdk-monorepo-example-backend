/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, ClassType, UseMiddleware } from 'type-graphql';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { mapper } from 'src/utils/mapper';

function createUpdateResolver(suffix: string, returnType: any, inputType: any, middleware?: Middleware<any>[]) {
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

    return BaseResolver as any;
}

export default createUpdateResolver;
