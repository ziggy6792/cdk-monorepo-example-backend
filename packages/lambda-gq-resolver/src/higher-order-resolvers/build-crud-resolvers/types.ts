import { Middleware } from 'type-graphql/dist/interfaces/Middleware';

export interface IResProps {
    middleware?: Middleware<any>[];
}

export type IOneAndOrManyProps<T> = IBaseOne<T> | IBaseMany<T> | (IBaseOne<T> & IBaseMany<T>);

export interface IBaseOne<T> {
    one: T;
}

export interface IBaseMany<T> {
    many: T;
}

export interface IResolverOptions<T> {
    resolverProps: IOneAndOrManyProps<T>;
}

export interface IInputResolverOptions<T> extends IResolverOptions<T> {
    inputType: any;
}

export interface IBaseCrudResolverOptions<T> {
    idFields?: string[];
    create?: IInputResolverOptions<T>;
    get?: IResolverOptions<T> | IInputResolverOptions<T>;
    update?: IInputResolverOptions<T>;
    delete?: IResolverOptions<T> | IInputResolverOptions<T>;
}

export interface IBuildResolversProps {
    suffix: string;
    returnType: any;
    idFields: string[];
    inputType?: any;
    resolverProps: {
        one: IResProps;
        many: IResProps;
    };
}

export type ICreateCrudResolverOptions = IBaseCrudResolverOptions<IResProps | boolean>;

export type ICompleteCrudResolverOptions = IBaseCrudResolverOptions<IResProps>;

// export type ResolverType = 'create' | 'update' | 'delete' | 'get';

export enum ResolverType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    GET = 'get',
}

export type CrudBuilders = { [key in ResolverType]?: (buildResolverProps: IBuildResolversProps) => any[] };
