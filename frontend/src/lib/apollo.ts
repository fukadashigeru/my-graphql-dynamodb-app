// frontend/src/lib/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';

const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL });

const errorLink = new ErrorLink(({ error }) => {
  if (!error) return;
  if (CombinedGraphQLErrors.is(error)) {
    console.error('[GraphQL error]', error.errors);
  } else {
    console.error('[Network error]', error);
  }
});

const link = ApolloLink.from([errorLink, httpLink]);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
