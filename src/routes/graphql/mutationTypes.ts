// type: createUserType,
//             args: {
//               firstName: {type: GraphQLString},
//               lastName: {type: GraphQLString},
//               email: {type: GraphQLString}

import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const createUserType = new GraphQLObjectType({
  name: "createUser",
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
  }),
});

//["avatar", "sex", "birthday", "country", "street", "city", "userId", "memberTypeId"]
export const createProfileType = new GraphQLObjectType({
  name: "createProfile",
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
      type: GraphQLInt,
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
    userId: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
  }),
});

export const createPostType = new GraphQLObjectType({
  name: "createPost",
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
      type: GraphQLString,
    },
  }),
});
