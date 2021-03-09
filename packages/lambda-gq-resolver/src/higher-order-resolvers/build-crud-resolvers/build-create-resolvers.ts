/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import pluralize from 'pluralize';
import _ from 'lodash';
import { mapDbException } from 'src/utils/utility';
import { IBuildResolverProps, Multiplicity } from './types';

const buildCreateResolvers = (buildResolversProps: IBuildResolverProps) => {
    const { suffix, returnType, resolversToBuild, idFields, inputType } = buildResolversProps;

    const createEntity = async (entity: any) => {
        try {
            await returnType.store.put(entity).ifNotExists().exec();
            return entity;
        } catch (err) {
            const keys = _.pickBy(entity, (value, key) => idFields.includes(key));
            throw mapDbException(err, `${suffix} ${JSON.stringify(keys)} already exists`);
        }
    };

    const resolvers = resolversToBuild.map((props) => {
        const { middleware } = props;

        if (props.multiplicityType === Multiplicity.ONE) {
            @Resolver()
            class CreateOneResolver {
                @Mutation(() => returnType, { name: `create${suffix}` })
                @UseMiddleware(...(middleware || []))
                async create(@Arg('input', () => inputType) input: any) {
                    const createdEntity = await createEntity(input);
                    return createdEntity;
                }
            }
            return CreateOneResolver;
        }
        if (props.multiplicityType === Multiplicity.MANY) {
            @Resolver()
            class CreateManyResolver {
                @Mutation(() => [returnType], { name: `create${pluralize.plural(suffix)}` })
                @UseMiddleware(...(middleware || []))
                async create(@Arg('input', () => [inputType]) inputs: any[]) {
                    const createFns = inputs.map((input) => async () => createEntity(input));
                    const createdEnties = await Promise.all(createFns.map((fn) => fn()));
                    return createdEnties;
                }
            }
            return CreateManyResolver;
        }
        throw new Error('This can never happen');
    });

    return resolvers;
};

export default buildCreateResolvers;
