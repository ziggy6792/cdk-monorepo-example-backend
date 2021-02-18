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
    one: IResProps | boolean;
}

export interface IManyResProps {
    many: IResProps | boolean;
}

export interface IResolverBuildProps extends IResProps {
    multiplicityType: Multiplicity;
}

export type IOneAndOrManyResProps = IOneResProps | IManyResProps | (IOneResProps & IManyResProps);

export interface ICrudProps {
    inputType?: any;
    resolverProps: IOneAndOrManyResProps;
}

export interface IBuildCrudReolversProps {
    inputType: any;
    resolvers: IResolverBuildProps[];
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

export type IBuildCrudProps = IBaseCrudProps<IInputCrudProps, ICrudProps | IInputCrudProps>;

export type ICompleteCrudProps = IBaseCrudProps<IBuildCrudReolversProps, IBuildCrudReolversProps>;

export interface IBuildResolversProps {
    suffix: string;
    returnType: any;
    idFields: string[];
    inputType?: any;
    resolverBuildProps: IResolverBuildProps[];
}

export type CrudBuilders = { [key in ResolverType]?: (buildResolverProps: IBuildResolversProps) => any[] };
