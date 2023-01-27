import fastify from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLInt, GraphQLSchema, GraphQLString } from "graphql/type";
import { changeMemberTypeBodySchema } from "../member-types/schema";

export const graphqlBodySchema = {
  type: "object",
  properties: {
    mutation: { type: "string" },
    query: { type: "string" },
    variables: {
      type: "object",
    },
  },
  oneOf: [
    {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string" },
        variables: {
          type: "object",
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      required: ["mutation"],
      properties: {
        mutation: { type: "string" },
        variables: {
          type: "object",
        },
      },
      additionalProperties: false,
    },
  ],
} as const;

// const memberTypesData = [
//   { id: "basic", discount: 10, monthPostsLimit: 50 },
//   { id: "business", discount: 20, monthPostsLimit: 100 },
// ];

export const memberTypeType = new GraphQLObjectType({
  name: "memberType",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});

export const postType = new GraphQLObjectType({
  name: "post",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString,
    },
  }),
});

export const profileType = new GraphQLObjectType({
  name: "profile",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString,
    },
  }),
});

export const userType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});
