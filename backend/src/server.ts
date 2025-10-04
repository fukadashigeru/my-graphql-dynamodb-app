import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

async function bootstrap() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    introspection: true,
  });

  await server.start();
  app.use(
    '/graphql',
    cors({ origin: ['http://localhost:5173'], credentials: false }),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({}),
    }),
  );

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`🚀 GraphQL at http://localhost:${port}/graphql`);
  });
}

bootstrap().catch((e) => {
  console.error('Server failed to start:', e);
  process.exit(1);
});
