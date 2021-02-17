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
import createCreateManyResolver from './create-create-many-resolver';

interface IOptions {
    middleware?: Middleware<any>[];
}

type IBaseResolverOptions<T> = IBaseOne<T> | IBaseMany<T> | (IBaseOne<T> & IBaseMany<T>);

interface IBaseOne<T> {
    one: T;
}

interface IBaseMany<T> {
    many: T;
}

interface IResolverOptions<T> {
    options: IBaseResolverOptions<T>;
}

interface IInputResolverOptions<T> extends IResolverOptions<T> {
    inputType: any;
}

interface IBaseCrudResolverOptions<T> {
    create?: IInputResolverOptions<T>;
    get?: IResolverOptions<T> | IInputResolverOptions<T>;
    update?: IInputResolverOptions<T>;
    delete?: IResolverOptions<T> | IInputResolverOptions<T>;
}

type ICreateCrudResolverOptions = IBaseCrudResolverOptions<IOptions | boolean>;

type ICompleteCrudResolverOptions = IBaseCrudResolverOptions<IOptions>;

const defaultOptions = {
    middleware: [],
};

const getOneAndManyOptions = <T>(options: IBaseResolverOptions<T>): IBaseOne<T> & IBaseMany<T> => ({
    one: ((options as IBaseOne<T>)?.one as unknown) as T,
    many: ((options as IBaseMany<T>)?.many as unknown) as T,
});

const applyDefaults = (resolverOptions: ICreateCrudResolverOptions): ICompleteCrudResolverOptions => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(resolverOptions)) {
        const resOptions = getOneAndManyOptions((value as IResolverOptions<IOptions | boolean>).options);

        resOptions.one = resOptions.one === true ? defaultOptions : resOptions.one;
        resOptions.many = resOptions.many === true ? defaultOptions : resOptions.many;
    }

    return resolverOptions as ICompleteCrudResolverOptions;
};

const createCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICreateCrudResolverOptions): any[] => {
    const { create: createOptions, get: getOptions, update: updateOptions, delete: deleteOptions } = applyDefaults(resolverOptions);
    console.log('resolverOptions', applyDefaults(resolverOptions));
    const crudResolvers = [];

    if (createOptions) {
        const fullCreateOptions = getOneAndManyOptions(createOptions.options);
        if (fullCreateOptions.one) {
            crudResolvers.push(createCreateResolver(suffix, returnType, createOptions.inputType, fullCreateOptions.one.middleware));
        }
        if (fullCreateOptions.many) {
            crudResolvers.push(createCreateManyResolver(suffix, returnType, createOptions.inputType, fullCreateOptions.many.middleware));
        }
    }
    if (getOptions) {
        const fullGetOptions = getOneAndManyOptions(getOptions.options);
        if (fullGetOptions.one) {
            crudResolvers.push(createGetResolver(suffix, returnType, fullGetOptions.one.middleware));
        }
        if (fullGetOptions.many) {
            crudResolvers.push(createListResolver(suffix, returnType, fullGetOptions.many.middleware));
        }
    }
    if (updateOptions) {
        const fullUpdateOptions = getOneAndManyOptions(updateOptions.options);
        if (fullUpdateOptions.one) {
            crudResolvers.push(createUpdateResolver(suffix, returnType, updateOptions.inputType, fullUpdateOptions.one.middleware));
        }
        if (fullUpdateOptions.many) {
            // Todo
        }
    }
    if (deleteOptions) {
        const fullDeleteOptions = getOneAndManyOptions(deleteOptions.options);
        if (fullDeleteOptions.one) {
            crudResolvers.push(createDeleteResolver(suffix, returnType, fullDeleteOptions.one.middleware));
        }
        if (fullDeleteOptions.many) {
            // Todo
        }
    }
    return crudResolvers;
};

export default createCrudResolvers;
