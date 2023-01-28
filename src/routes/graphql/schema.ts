import { GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLID, GraphQLInt, GraphQLString } from "graphql/type";

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
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLID,
    },
  }),
});

export const profileType = new GraphQLObjectType({
  name: "profile",
  fields: () => ({
    id: {
      type: GraphQLID,
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
      type: GraphQLID,
    },
  }),
});

export const userType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: {
      type: GraphQLID,
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
      type: new GraphQLList(GraphQLID),
    },
  }),
});

export const userFullInfoType = new GraphQLObjectType({
  name: "userFullInfo",
  fields: () => ({
    user: {
      type: userType,
    },
    userPosts: {
      type: new GraphQLList(postType),
    },
    userProfiles: {
      type: new GraphQLList(profileType),
    },
    userMemberTypes: {
      type: new GraphQLList(memberTypeType),
    },
  }),
});
