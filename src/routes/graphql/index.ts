import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from "graphql";
import { graphqlBodySchema, memberTypeType, postType, profileType, userType } from "./schema";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      console.log(" request");
      // The rootValue provides a resolver function for each API endpoint
      const rootQuery = new GraphQLObjectType({
        name: "RootQuery",
        description: "This is the root query",
        fields: {
          memberTypes: {
            type: new GraphQLList(memberTypeType),
            //args: { id: { type: GraphQLString } },
            resolve(parent, args, context) {
              fastify.db.memberTypes.findMany();
            },
          },
          profiles: {
            type: new GraphQLList(profileType),
            //args: { id: { type: GraphQLID } },
            resolve(parent, args) {
              fastify.db.profiles.findMany();
            },
          },
          posts: {
            type: new GraphQLList(postType),
            //args: { id: { type: GraphQLID } },
            resolve(parent, args) {
              fastify.db.posts.findMany();
            },
          },
          users: {
            type: new GraphQLList(userType),
            //args: { id: { type: GraphQLID } },
            resolve(parent, args) {
              fastify.db.posts.findMany();
            },
          },
        },
      });

      const schema = new GraphQLSchema({
        query: rootQuery,
        types: [memberTypeType, profileType, postType, userType],
      });

      return await graphql({
        schema,
        source: String(request.body.query),
        // contextValue: fastify,
      });
    }
  );
};

export default plugin;
