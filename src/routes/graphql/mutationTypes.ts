// type: createUserType,
//             args: {
//               firstName: {type: GraphQLString},
//               lastName: {type: GraphQLString},
//               email: {type: GraphQLString}

import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

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
