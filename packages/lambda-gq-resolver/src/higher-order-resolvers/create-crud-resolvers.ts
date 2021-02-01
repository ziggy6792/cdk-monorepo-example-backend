/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import createCreateResolver from './create-create-resolver';
import createListResolver from './create-list-resolver';
import createGetResolver from './create-get-resolver';
import createUpdateResolver from './create-update-resolver';
import createDeleteResolver from './create-delete-resolver';

interface IResolverOptions {
    middleware?: Middleware<any>[];
}

interface IInputResolverOptions extends IResolverOptions {
    inputType: any;
}

interface ICrudResolverOptions {
    create?: IInputResolverOptions;
    list?: IResolverOptions | boolean;
    get?: IResolverOptions | boolean;
    update?: IInputResolverOptions;
    delete?: IResolverOptions | boolean;
}

const getMiddleware = (resolverOptions: IResolverOptions | boolean): any[] => {
    if ((resolverOptions as IResolverOptions).middleware) {
        return (resolverOptions as IResolverOptions).middleware;
    }
    return [];
};

const createCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICrudResolverOptions): any[] => {
    const { create: createOptions, list: listOptions, get: getOptions, update: updateOptions, delete: deleteOptions } = resolverOptions;
    const crudResolvers = [];
    if (createOptions) {
        crudResolvers.push(createCreateResolver(suffix, returnType, createOptions.inputType, createOptions.middleware));
    }
    if (listOptions) {
        crudResolvers.push(createListResolver(suffix, returnType, getMiddleware(listOptions)));
    }
    if (getOptions) {
        crudResolvers.push(createGetResolver(suffix, returnType, getMiddleware(getOptions)));
    }
    if (updateOptions) {
        crudResolvers.push(createUpdateResolver(suffix, returnType, updateOptions.inputType, updateOptions.middleware));
    }
    if (deleteOptions) {
        crudResolvers.push(createDeleteResolver(suffix, returnType, getMiddleware(deleteOptions)));
    }
    return crudResolvers;
};

export default createCrudResolvers;
