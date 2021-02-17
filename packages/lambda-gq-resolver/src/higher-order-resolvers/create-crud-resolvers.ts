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

interface IResProps {
    middleware?: Middleware<any>[];
}

type IOneAndOrManyProps<T> = IBaseOne<T> | IBaseMany<T> | (IBaseOne<T> & IBaseMany<T>);

interface IBaseOne<T> {
    one: T;
}

interface IBaseMany<T> {
    many: T;
}

interface IResolverOptions<T> {
    resolvers: IOneAndOrManyProps<T>;
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

type ICreateCrudResolverOptions = IBaseCrudResolverOptions<IResProps | boolean>;

type ICompleteCrudResolverOptions = IBaseCrudResolverOptions<IResProps>;

const defaultResolverProps = {
    middleware: [],
};

const getOneAndManyProps = <T>(options: IOneAndOrManyProps<T>): IBaseOne<T> & IBaseMany<T> => ({
    one: ((options as IBaseOne<T>)?.one as unknown) as T,
    many: ((options as IBaseMany<T>)?.many as unknown) as T,
});

const applyDefaults = (resolverOptions: ICreateCrudResolverOptions): ICompleteCrudResolverOptions => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(resolverOptions)) {
        const resProps = getOneAndManyProps((value as IResolverOptions<IResProps | boolean>).resolvers);

        resProps.one = resProps.one === true ? defaultResolverProps : resProps.one;
        resProps.many = resProps.many === true ? defaultResolverProps : resProps.many;
    }

    return resolverOptions as ICompleteCrudResolverOptions;
};

const createCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICreateCrudResolverOptions): any[] => {
    const { create: createOptions, get: getOptions, update: updateOptions, delete: deleteOptions } = applyDefaults(resolverOptions);
    // console.log('resolverOptions', applyDefaults(resolverOptions));
    const crudResolvers = [];

    if (createOptions) {
        const resolverProps = getOneAndManyProps(createOptions.resolvers);
        if (resolverProps.one) {
            crudResolvers.push(createCreateResolver(suffix, returnType, createOptions.inputType, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            crudResolvers.push(createCreateManyResolver(suffix, returnType, createOptions.inputType, resolverProps.many.middleware));
        }
    }
    if (getOptions) {
        const resolverProps = getOneAndManyProps(getOptions.resolvers);
        if (resolverProps.one) {
            crudResolvers.push(createGetResolver(suffix, returnType, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            crudResolvers.push(createListResolver(suffix, returnType, resolverProps.many.middleware));
        }
    }
    if (updateOptions) {
        const resolverProps = getOneAndManyProps(updateOptions.resolvers);
        if (resolverProps.one) {
            crudResolvers.push(createUpdateResolver(suffix, returnType, updateOptions.inputType, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            // Todo
        }
    }
    if (deleteOptions) {
        const resolverProps = getOneAndManyProps(deleteOptions.resolvers);
        if (resolverProps.one) {
            crudResolvers.push(createDeleteResolver(suffix, returnType, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            // Todo
        }
    }
    return crudResolvers;
};

export default createCrudResolvers;
