import { Middleware } from 'type-graphql/dist/interfaces/Middleware';

export enum ResolverType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    GET = 'get',
}

export enum Multiplicity {
    ONE = 'one',
    MANY = 'many',
}

export interface IResProps {
    middleware?: Middleware<any>[];
}

export interface IOneResProps {
    one: IResProps;
}

export interface IManyResProps {
    many: IResProps;
}

export interface IMultiplicityResProps extends IResProps {
    multiplicityType: Multiplicity;
}

export type IOneAndOrManyResProps = IOneResProps | IManyResProps | (IOneResProps & IManyResProps);

export interface ICrudProps {
    inputType?: any;
    resolverProps: IOneAndOrManyResProps;
}

export interface IBuildCrudReolversProps {
    inputType: any;
    resolvers: IMultiplicityResProps[];
}

export interface IInputCrudProps extends ICrudProps {
    inputType: any;
}

export interface IBaseCrudProps<CreateUpdate, GetDelte> {
    idFields?: string[];
    crudProps: {
        create?: CreateUpdate;
        get?: GetDelte;
        update?: CreateUpdate;
        delete?: GetDelte;
    };
}

export type IBuildCrudProps = IBaseCrudProps<ICrudProps | IInputCrudProps, ICrudProps>;

export type ICompleteCrudProps = IBaseCrudProps<IBuildCrudReolversProps, IBuildCrudReolversProps>;

export interface IBuildResolversProps {
    suffix: string;
    returnType: any;
    idFields: string[];
    inputType?: any;
    resolvers: IMultiplicityResProps[];
}

// export type ResolverType = 'create' | 'update' | 'delete' | 'get';

export type CrudBuilders = { [key in ResolverType]?: (buildResolverProps: IBuildResolversProps) => any[] };
