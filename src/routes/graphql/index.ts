import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
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
          memberType: {
            type: memberTypeType,
            args: { id: { type: GraphQLString } },
            async resolve(parent, args, context) {
              const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: args.id });
              if (memberType) return memberType;
              throw fastify.httpErrors.notFound("Not found");
            },
          },
          profile: {
            type: new GraphQLList(profileType),
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const profile = await fastify.db.profiles.findOne({ key: "id", equals: args.id });
              if (profile) return profile;
              throw fastify.httpErrors.notFound("Not found");
            },
          },
          post: {
            type: new GraphQLList(postType),
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const post = await fastify.db.posts.findOne({ key: "id", equals: args.id });
              if (post) return post;
              throw fastify.httpErrors.notFound("Not found");
            },
          },
          user: {
            type: new GraphQLList(userType),
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const user = await fastify.db.users.findOne({ key: "id", equals: args.id });
              if (user) return user;
              throw fastify.httpErrors.notFound("Not found");
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
