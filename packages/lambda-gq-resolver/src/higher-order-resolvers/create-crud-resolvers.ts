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

export enum Multiplicity {
    SINGLE = 'SINGLE',
    MANY = 'MANY',
}

const defaultResolverOptions = {
    create: {
        multiplicity: [Multiplicity.SINGLE],
        middleware: [],
    },
    get: {
        multiplicity: [Multiplicity.SINGLE, Multiplicity.MANY],
        middleware: [],
    },
    update: {
        multiplicity: [Multiplicity.SINGLE],
        middleware: [],
    },
    delete: {
        multiplicity: [Multiplicity.SINGLE],
        middleware: [],
    },
};
interface IResolverOptions {
    middleware?: Middleware<any>[];
    multiplicity?: Multiplicity[];
}

interface IInputResolverOptions extends IResolverOptions {
    inputType: any;
}

// interface ICrudResolverOptions {
//     create?: IInputResolverOptions;
//     get?: IResolverOptions;
//     update?: IInputResolverOptions;
//     delete?: IResolverOptions;
// }

interface ICrudResolverOptions {
    create?: IInputResolverOptions;
    get?: IResolverOptions | boolean;
    update?: IInputResolverOptions;
    delete?: IResolverOptions | boolean;
}

interface ICompleteCrudResolverOptions {
    create?: IInputResolverOptions;
    get?: IResolverOptions;
    update?: IInputResolverOptions;
    delete?: IResolverOptions;
}

const getMiddleware = (resolverOptions: IResolverOptions | boolean): any[] => {
    if ((resolverOptions as IResolverOptions).middleware) {
        return (resolverOptions as IResolverOptions).middleware;
    }
    return [];
};

const applyResolverDefaults = <T extends IResolverOptions>(resolverOptions: T, defOptions: IResolverOptions): T => {
    if (!resolverOptions) {
        return undefined;
    }
    return {
        ...defOptions,
        ...resolverOptions,
    };
};

// const applyDefaults = ({ create, get, update, delete: deleteOptions }: ICrudResolverOptions): ICompleteCrudResolverOptions => ({
//     create: applyResolverDefaults(create, defaultGetResolverOptions),
//     get: applyResolverDefaults(typeof get === 'boolean' ? {} : get),
//     update: applyResolverDefaults(update),
//     delete: applyResolverDefaults(typeof deleteOptions === 'boolean' ? {} : deleteOptions),
// });

const applyDefaults = (resolverOptions: ICrudResolverOptions): ICompleteCrudResolverOptions => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(resolverOptions)) {
        resolverOptions[key] = applyResolverDefaults(typeof value === 'boolean' ? {} : value, defaultResolverOptions[key]);
    }
    return resolverOptions as ICompleteCrudResolverOptions;
};

const createCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICrudResolverOptions): any[] => {
    const { create: createOptions, get: getOptions, update: updateOptions, delete: deleteOptions } = applyDefaults(resolverOptions);
    console.log('resolverOptions', applyDefaults(resolverOptions));
    const crudResolvers = [];
    if (createOptions) {
        if (createOptions.multiplicity.includes(Multiplicity.SINGLE)) {
            crudResolvers.push(createCreateResolver(suffix, returnType, createOptions.inputType, createOptions.middleware));
        }
        if (createOptions.multiplicity.includes(Multiplicity.MANY)) {
            crudResolvers.push(createCreateManyResolver(suffix, returnType, createOptions.inputType, createOptions.middleware));
        }
    }
    if (getOptions) {
        if (getOptions.multiplicity.includes(Multiplicity.SINGLE)) {
            crudResolvers.push(createGetResolver(suffix, returnType, getMiddleware(getOptions)));
        }
        if (getOptions.multiplicity.includes(Multiplicity.MANY)) {
            crudResolvers.push(createListResolver(suffix, returnType, getMiddleware(getOptions)));
        }
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
