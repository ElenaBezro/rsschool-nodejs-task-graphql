import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

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

export const createUserInputType = new GraphQLInputObjectType({
  name: "createUserInput",
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
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
export const createProfileInputType = new GraphQLInputObjectType({
  name: "createProfileInput",
  fields: () => ({
    avatar: {
      type: new GraphQLNonNull(GraphQLString),
    },
    sex: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
    },
    street: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLString),
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

export const createPostInputType = new GraphQLInputObjectType({
  name: "createPostInput",
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },

    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});
