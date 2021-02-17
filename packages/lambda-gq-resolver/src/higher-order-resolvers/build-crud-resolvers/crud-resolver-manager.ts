import { buildGetResolvers } from './build-get-resolver';
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { buildCreateResolvers } from './build-create-resolver';
import { buildDeleteResolvers } from './build-delete-resolver';
import { buildUpdateResolvers } from './build-update-resolver';
import {
    IBaseOne,
    IOneAndOrManyProps,
    IBaseMany,
    ICompleteCrudResolverOptions,
    ICreateCrudResolverOptions,
    IResolverOptions,
    IResProps,
    IBuildResolversProps,
    ResolverType,
    CrudBuilders,
} from './types';

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

class CrudResolverManager {
    private completeOptions: ICompleteCrudResolverOptions;

    private suffix: string;

    private returnType: any;

    private crudResolvers: any[];

    constructor(suffix: string, returnType: any, createCrud: ICreateCrudResolverOptions) {
        console.log(createCrud);
        this.completeOptions = applyDefaults(createCrud);
        this.suffix = suffix;
        this.returnType = returnType;
        this.crudResolvers = [];

        this.buildCreateResolvers();
    }

    // buildCrud(crudBuilders: CrudBuilders){
    //     this.completeOptions.
    // }

    getCrudResolvers() {
        return this.crudResolvers;
    }

    getBuildResolversProps(resolverType: ResolverType): IBuildResolversProps | null {
        if (!this.completeOptions[resolverType]) {
            return null;
        }

        const resolverProps = getExpandedResolverProps(this.completeOptions[resolverType].resolverProps);

        const ret = {
            suffix: this.suffix,
            returnType: this.returnType,
            inputType: this.completeOptions[resolverType as ResolverType.CREATE | ResolverType.UPDATE]?.inputType,
            idFields: this.completeOptions.idFields,
            resolverProps: {
                one: resolverProps.one,
                many: resolverProps.many,
            },
        };
        return ret;
    }

    buildResolvers(resolverType: ResolverType, buildFunction: (buildResolverProps: IBuildResolversProps) => any[]): any[] {
        const buildResolverProps = this.getBuildResolversProps(resolverType);

        if (!buildResolverProps) {
            return [];
        }
        return buildFunction(buildResolverProps);
    }

    buildCreateResolvers() {
        const crateResolverProps = this.getBuildResolversProps(ResolverType.CREATE);

        if (crateResolverProps) {
            this.appendResolvers(buildCreateResolvers(crateResolverProps));
        }
    }

    appendResolvers(resolvers: any[]) {
        this.crudResolvers = [...this.crudResolvers, ...resolvers];
    }
}

export default CrudResolverManager;
