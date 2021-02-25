import gql from 'graphql-tag';
import { apolloClient } from 'src/utils/apollo-client';

const REGISTER = gql`
    mutation createUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id
        }
    }
`;

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export const registerUser = async (user: IUser): Promise<boolean> => {
    try {
        // const response = await client.query({ query: HELLO });
        const response = await apolloClient.mutate({
            mutation: REGISTER,
            variables: {
                input: user,
            },
        });
        return true;
    } catch (err) {
        console.log('ERROR');

        console.log({ err });
        return false;
    }
};
