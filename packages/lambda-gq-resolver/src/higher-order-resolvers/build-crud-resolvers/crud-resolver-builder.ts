import _ from 'lodash';
import {
    IMultiplicityResProps,
    Multiplicity,
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
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */

const defaultResolverProps = {
    middleware: [],
};

const getExpandedResolverProps = <T>(options: IOneAndOrManyProps<T>): IBaseOne<T> & IBaseMany<T> => ({
    one: ((options as IBaseOne<T>)?.one as unknown) as T,
    many: ((options as IBaseMany<T>)?.many as unknown) as T,
});

const getResolverPropsAsList = <T>(options: IOneAndOrManyProps<T>): IMultiplicityResProps[] => {
    const retProps: IMultiplicityResProps[] = [];

    const one = ((options as IBaseOne<T>)?.one as unknown) as T;
    const many = ((options as IBaseMany<T>)?.many as unknown) as T;

    if (one) {
        retProps.push({ ...defaultResolverProps, ...one, multiplicityType: Multiplicity.ONE });
    }
    if (many) {
        retProps.push({ ...defaultResolverProps, ...many, multiplicityType: Multiplicity.MANY });
    }
    return retProps;
};

const applyDefaults = (crudOptions: ICreateCrudResolverOptions): ICompleteCrudResolverOptions => {
    const completeOptions: Partial<ICompleteCrudResolverOptions> = {};

    for (const [key, value] of Object.entries(crudOptions.resolvers)) {
        const resolverType = key as keyof typeof crudOptions.resolvers;
        const resolverOptions = value as IResolverOptions<IResProps | boolean>;

        const resPropsAsList = getResolverPropsAsList(resolverOptions.resolverProps);

        completeOptions.idFields = crudOptions.idFields;
        completeOptions.resolvers = {};

        completeOptions.resolvers[resolverType] = { resolverProps: null, inputType: null };
        completeOptions.resolvers[resolverType].inputType = (crudOptions.resolvers[resolverType] as any).inputType;
        completeOptions.resolvers[resolverType].resolverProps = resPropsAsList;
    }
    crudOptions.idFields = crudOptions.idFields || ['id'];

    return completeOptions as ICompleteCrudResolverOptions;
};

class CrudResolverBuilder {
    private crudBuilders: CrudBuilders;

    constructor(crudBuilders: CrudBuilders) {
        this.crudBuilders = crudBuilders;
    }

    public buildCrudResolvers(suffix: string, returnType: any, createCrudOptions: ICreateCrudResolverOptions): any[] {
        const completeOptions = applyDefaults(createCrudOptions);

        const generateResolversProps = (resolverType: ResolverType): IBuildResolversProps | null => {
            if (!completeOptions.resolvers[resolverType]) {
                return null;
            }
            const ret = {
                suffix,
                returnType,
                inputType: completeOptions.resolvers[resolverType as ResolverType.CREATE | ResolverType.UPDATE]?.inputType,
                idFields: completeOptions.idFields,
                resolverProps: completeOptions.resolvers[resolverType].resolverProps,
            };
            return ret;
        };

        let resolvers = [];

        for (const [key] of Object.entries(completeOptions.resolvers)) {
            const ressolverType = key as ResolverType;

            const crateResolverProps = generateResolversProps(ressolverType);

            if (crateResolverProps) {
                const buildResolversFunstion = this.crudBuilders[ressolverType];
                resolvers = _.concat(resolvers, buildResolversFunstion(crateResolverProps));
            }
        }

        return resolvers;
    }
}

export default CrudResolverBuilder;
