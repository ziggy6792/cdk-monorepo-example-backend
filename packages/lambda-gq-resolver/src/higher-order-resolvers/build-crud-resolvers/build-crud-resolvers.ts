/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { buildCreateOneResolver, buildCreateManyResolver } from './build-create-resolver';
import { buildGetOneResolver, builGetManyResolver } from './build-get-resolver';
import { buildUpdateManyResolver, buildUpdateOneResolver } from './build-update-resolver';
import { buildDeleteManyResolver, buildDeleteOneResolver } from './build-delete-resolver';

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
    resolverProps: IOneAndOrManyProps<T>;
}

interface IInputResolverOptions<T> extends IResolverOptions<T> {
    inputType: any;
}

interface IBaseCrudResolverOptions<T> {
    idFields?: string[];
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

const getExpandedResolverProps = <T>(options: IOneAndOrManyProps<T>): IBaseOne<T> & IBaseMany<T> => ({
    one: ((options as IBaseOne<T>)?.one as unknown) as T,
    many: ((options as IBaseMany<T>)?.many as unknown) as T,
});

const applyDefaults = (crudOptions: ICreateCrudResolverOptions): ICompleteCrudResolverOptions => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(crudOptions)) {
        const resolverOptions = value as IResolverOptions<IResProps | boolean>;

        const resProps = getExpandedResolverProps(resolverOptions.resolverProps);

        resProps.one = resProps.one === true ? defaultResolverProps : resProps.one;
        resProps.many = resProps.many === true ? defaultResolverProps : resProps.many;
    }
    crudOptions.idFields = crudOptions.idFields || ['id'];

    return crudOptions as ICompleteCrudResolverOptions;
};

const buildCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICreateCrudResolverOptions): any[] => {
    const { create: createOptions, get: getOptions, update: updateOptions, delete: deleteOptions, idFields } = applyDefaults(resolverOptions);
    // console.log('resolverOptions', applyDefaults(resolverOptions));
    const crudResolvers = [];

    if (createOptions) {
        const resolverProps = getExpandedResolverProps(createOptions.resolverProps);
        if (resolverProps.one) {
            crudResolvers.push(buildCreateOneResolver(suffix, returnType, createOptions.inputType, idFields, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            crudResolvers.push(buildCreateManyResolver(suffix, returnType, createOptions.inputType, idFields, resolverProps.many.middleware));
        }
    }
    if (getOptions) {
        const resolverProps = getExpandedResolverProps(getOptions.resolverProps);
        if (resolverProps.one) {
            crudResolvers.push(buildGetOneResolver(suffix, returnType, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            crudResolvers.push(builGetManyResolver(suffix, returnType, resolverProps.many.middleware));
        }
    }
    if (updateOptions) {
        const resolverProps = getExpandedResolverProps(updateOptions.resolverProps);
        if (resolverProps.one) {
            crudResolvers.push(buildUpdateOneResolver(suffix, returnType, updateOptions.inputType, idFields, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            crudResolvers.push(buildUpdateManyResolver(suffix, returnType, updateOptions.inputType, idFields, resolverProps.many.middleware));
        }
    }
    if (deleteOptions) {
        const resolverProps = getExpandedResolverProps(deleteOptions.resolverProps);
        if (resolverProps.one) {
            crudResolvers.push(buildDeleteOneResolver(suffix, returnType, resolverProps.one.middleware));
        }
        if (resolverProps.many) {
            crudResolvers.push(buildDeleteManyResolver(suffix, returnType, resolverProps.many.middleware));
        }
    }
    return crudResolvers;
};

export default buildCrudResolvers;
