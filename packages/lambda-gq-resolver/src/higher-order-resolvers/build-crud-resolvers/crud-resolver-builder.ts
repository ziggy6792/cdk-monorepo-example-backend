/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */

import _ from 'lodash';
import {
    IMultiplicityResProps,
    Multiplicity,
    IOneResProps,
    IOneAndOrManyResProps,
    IManyResProps,
    ICrudProps,
    IResProps,
    IBuildResolversProps,
    ResolverType,
    CrudBuilders,
    ICompleteCrudProps,
    IBuildCrudProps,
} from './types';

const defaultResolverProps = {
    middleware: [],
};

const buildCrudPropsToCompleteCrudProps = (buildCrudProps: IBuildCrudProps): ICompleteCrudProps => {
    const completeCrudProps: Partial<ICompleteCrudProps> = {};

    completeCrudProps.idFields = buildCrudProps.idFields || ['id'];

    completeCrudProps.crudProps = {};

    Object.keys(buildCrudProps.crudProps).forEach((resolverType: ResolverType) => {
        const { resolverProps } = buildCrudProps.crudProps[resolverType];

        completeCrudProps.crudProps[resolverType] = {
            inputType: buildCrudProps.crudProps[resolverType].inputType,
            resolvers: [],
        };

        const oneProps = resolverProps as IOneResProps;
        if (oneProps.one) {
            console.log('one');
            const passedInProps = oneProps.one === true ? {} : oneProps.one;
            completeCrudProps.crudProps[resolverType].resolvers.push({ ...defaultResolverProps, ...passedInProps, multiplicityType: Multiplicity.ONE });
        }
        const manyProps = resolverProps as IManyResProps;
        if (manyProps.many) {
            console.log('many');
            const passedInProps = manyProps.many === true ? {} : manyProps.many;
            completeCrudProps.crudProps[resolverType].resolvers.push({ ...defaultResolverProps, ...passedInProps, multiplicityType: Multiplicity.MANY });
        }
    });
    return completeCrudProps as ICompleteCrudProps;
};

// const applyDefaults = (crudOptions: ICreateCrudResolverOptions): ICompleteCrudResolverOptions => {
//     const completeOptions: Partial<ICompleteCrudResolverOptions> = {};

//     for (const [key, value] of Object.entries(crudOptions.resolvers)) {
//         const resolverType = key as keyof typeof crudOptions.resolvers;
//         const resolverOptions = value as ICrudProps<IResProps | boolean>;

//         const resPropsAsList = getResolverPropsAsList(resolverOptions.resolverProps);

//         completeOptions.idFields = crudOptions.idFields;
//         completeOptions.resolvers = {};

//         completeOptions.resolvers[resolverType] = { resolverProps: null, inputType: null };
//         completeOptions.resolvers[resolverType].inputType = (crudOptions.resolvers[resolverType] as any).inputType;
//         completeOptions.resolvers[resolverType].resolverProps = resPropsAsList;
//     }
//     crudOptions.idFields = crudOptions.idFields || ['id'];

//     return completeOptions as ICompleteCrudResolverOptions;
// };

class CrudResolverBuilder {
    private crudBuilders: CrudBuilders;

    constructor(crudBuilders: CrudBuilders) {
        this.crudBuilders = crudBuilders;
    }

    public buildCrudResolvers(suffix: string, returnType: any, createCrudOptions: IBuildCrudProps): any[] {
        // const completeOptions = applyDefaults(createCrudOptions);

        const completeCrudProps = buildCrudPropsToCompleteCrudProps(createCrudOptions);

        const generateResolversProps = (resolverType: ResolverType): IBuildResolversProps | null => {
            if (!completeCrudProps.crudProps[resolverType]) {
                return null;
            }
            const ret = {
                suffix,
                returnType,
                idFields: completeCrudProps.idFields,
                inputType: completeCrudProps.crudProps[resolverType].inputType,
                resolvers: completeCrudProps.crudProps[resolverType].resolvers,
            };
            return ret;
        };

        let resolvers = [];

        Object.keys(completeCrudProps.crudProps).forEach((resolverType: ResolverType) => {
            const crateResolverProps = generateResolversProps(resolverType);

            if (crateResolverProps) {
                const buildResolversFunstion = this.crudBuilders[resolverType];
                resolvers = _.concat(resolvers, buildResolversFunstion(crateResolverProps));
            }
        });

        return resolvers;
    }
}

export default CrudResolverBuilder;
