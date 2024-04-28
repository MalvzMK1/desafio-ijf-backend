/* istanbul ignore file */

import { Module } from "@nestjs/common";
import * as Resolvers from "./graphql/resolvers";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import * as path from "node:path";
import { AppContext } from "./types/app-context";

interface ExpressContext {
  req: AppContext["request"];
  res: AppContext["response"];
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      sortSchema: true,
      playground: true,
      introspection: true,
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), "dist", "schema.gql"),
      context: ({ req, res }: ExpressContext): AppContext => ({
        request: req,
        response: res,
      }),
    }),
  ],
  controllers: [],
  providers: [...Object.values(Resolvers)],
})
export class AppModule {}
