import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { createUserType } from "./mutationTypes";
import {
  getAllUsersPostsProfilesMemberTypesType,
  graphqlBodySchema,
  memberTypeType,
  postType,
  profileType,
  userFullInfoType,
  usersWithFullSubscriptionInfoType,
  usersWithUserSubscribedToProfile,
  userType,
  userWithUserSubscribedToPosts,
} from "./schema";

type SubscriptionInfo = {
  userId: string;
  subscribedToUser: string[];
  userSubscribedTo: string[];
};

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const User1 = await fastify.db.users.create({
        firstName: "Lena",
        lastName: "Gjhkjkj",
        email: "xvx@mail.com",
      });

      const User2 = await fastify.db.users.create({
        firstName: "Max",
        lastName: "Gjhkjkj",
        email: "xvx@mail.com",
      });

      await fastify.db.profiles.create({
        avatar: "foto",
        sex: "male",
        birthday: 22111900,
        country: "Ge",
        street: "BL",
        city: "Berlin",
        userId: User1.id,
        memberTypeId: "basic",
      });

      await fastify.db.profiles.create({
        avatar: "foto",
        sex: "male",
        birthday: 22111900,
        country: "Ge",
        street: "BL",
        city: "Berlin",
        userId: User2.id,
        memberTypeId: "business",
      });

      await fastify.db.posts.create({
        userId: User1.id,
        title: "Article",
        content: "blala",
      });

      // The rootValue provides a resolver function for each API endpoint
      const rootQuery = new GraphQLObjectType({
        name: "RootQuery",
        description: "This is the root query",
        fields: {
          getAllUsersPostsProfilesMemberTypes: {
            type: getAllUsersPostsProfilesMemberTypesType,
            async resolve(parent, args, context) {
              const users = await fastify.db.users.findMany();
              const usersID: string[] = users.map((user: UserEntity): string => user.id);

              const posts = await fastify.db.posts.findMany();
              const postsID: string[] = posts.map((post: PostEntity): string => post.id);

              const profiles = await fastify.db.profiles.findMany();
              const profilesID: string[] = profiles.map((profile: ProfileEntity): string => profile.id);

              const memberTypes = await fastify.db.memberTypes.findMany();
              const memberTypesID: string[] = memberTypes.map((memberType: MemberTypeEntity): string => memberType.id);

              const result = { users: usersID, posts: postsID, profiles: profilesID, memberTypes: memberTypesID };
              return result;
            },
          },
          memberTypes: {
            type: new GraphQLList(memberTypeType),
            async resolve(parent, args, context) {
              return await fastify.db.memberTypes.findMany();
            },
          },
          profiles: {
            type: new GraphQLList(profileType),
            async resolve(parent, args) {
              return await fastify.db.profiles.findMany();
            },
          },
          posts: {
            type: new GraphQLList(postType),
            //args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
              return await fastify.db.posts.findMany();
            },
          },
          users: {
            type: new GraphQLList(userType),
            async resolve(parent, args) {
              return await fastify.db.users.findMany();
            },
          },
          memberType: {
            type: memberTypeType,
            args: { memberTypeId: { type: GraphQLString } },
            async resolve(parent, args, context) {
              const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: args.memberTypeId });
              if (!memberType) throw fastify.httpErrors.notFound("Not found");
              return memberType;
            },
          },
          profile: {
            type: profileType,
            args: { profileId: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const profile = await fastify.db.profiles.findOne({ key: "id", equals: args.profileId });
              if (!profile) throw fastify.httpErrors.notFound("Not found");
              return profile;
            },
          },
          post: {
            type: postType,
            args: { postId: { type: GraphQLID } },
            async resolve(parent, args, context) {
              console.log("args", JSON.stringify(args));
              console.log("parent", JSON.stringify(parent));
              const post = await fastify.db.posts.findOne({ key: "id", equals: args.postId });
              if (!post) throw fastify.httpErrors.notFound("Not found");
              return post;
            },
          },
          user: {
            type: userType,
            args: { userIdd: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const user = await fastify.db.users.findOne({ key: "id", equals: args.userIdd });
              if (!user) throw fastify.httpErrors.notFound("Not found");
              return user;
            },
          },
          getUserPostProfileMemberType: {
            type: userFullInfoType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const user = await fastify.db.users.findOne({ key: "id", equals: args.id });
              if (!user) throw fastify.httpErrors.notFound("Not found");
              const userPosts = await fastify.db.posts.findMany({ key: "userId", equals: args.id });
              const userProfile = await fastify.db.profiles.findOne({ key: "userId", equals: args.id });

              if (!userProfile) return { user, userPosts, userProfile, userMemberType: null };
              const userMemberType = await fastify.db.memberTypes.findOne({ key: "id", equals: userProfile.memberTypeId });

              return { user, userPosts, userProfile, userMemberType };
            },
          },

          getUsersPostProfileMemberType: {
            type: new GraphQLList(userFullInfoType),
            async resolve(parent, args, context) {
              const users = await fastify.db.users.findMany();
              if (!users) throw fastify.httpErrors.notFound("Not found");
              return Promise.all(
                users.map(async (user) => {
                  const userPosts = await fastify.db.posts.findMany({ key: "userId", equals: user.id });
                  const userProfile = await fastify.db.profiles.findOne({ key: "userId", equals: user.id });
                  if (!userProfile) return { user, userPosts, userProfile, userMemberType: null };
                  const userMemberType = await fastify.db.memberTypes.findOne({ key: "id", equals: userProfile.memberTypeId });
                  return { user, userPosts, userProfile, userMemberType };
                })
              );
            },
          },

          getUsersWithUserSubscribedToProfile: {
            type: new GraphQLList(usersWithUserSubscribedToProfile),
            async resolve(parent, args, context) {
              const users = await fastify.db.users.findMany();
              const result = users.map(async (user) => {
                const userSubscribedTo = await fastify.db.users.findMany({ key: "subscribedToUserIds", inArray: user.id });
                const userProfile = await fastify.db.profiles.findOne({ key: "userId", equals: user.id });
                if (userProfile) return { user, userSubscribedTo, userProfile };
                return { user, userSubscribedTo, userProfile: null };
              });
              return result;
            },
          },

          getUserWithUserSubscribedToPosts: {
            type: userWithUserSubscribedToPosts,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, context) {
              const user = await fastify.db.users.findOne({ key: "id", equals: args.id });
              if (user) {
                const userPosts = await fastify.db.posts.findMany({ key: "userId", equals: args.id });
                if (userPosts) return { user, subscribedToUser: user.subscribedToUserIds || [], userPosts };
                return { user, subscribedToUser: user.subscribedToUserIds || [], userPosts: null };
              }
              throw fastify.httpErrors.notFound("Not found");
            },
          },

          getUsersWithFullSubscriptionInfo: {
            type: new GraphQLList(usersWithFullSubscriptionInfoType),
            async resolve(parent, args, context) {
              const users = await fastify.db.users.findMany();

              const getSubscriptionInfo = async (userId: string): Promise<SubscriptionInfo> => {
                const user = await fastify.db.users.findOne({ key: "id", equals: userId });
                if (user) {
                  const subscribedToUser = user.subscribedToUserIds;
                  const userSubscribedTo = await fastify.db.users.findMany({ key: "subscribedToUserIds", inArray: user.id });
                  const subscriptionInfo = { userId, subscribedToUser, userSubscribedTo: userSubscribedTo.map((user) => user.id) };
                  return subscriptionInfo;
                }
                throw fastify.httpErrors.notFound("Not found");
              };

              const result = users.map(async (user) => {
                const userSubscribedToEntities = await fastify.db.users.findMany({ key: "subscribedToUserIds", inArray: user.id });
                const userSubscribedTo = userSubscribedToEntities.map(async (user) => await getSubscriptionInfo(user.id));
                const subscribedToUser = user.subscribedToUserIds.map(async (id) => await getSubscriptionInfo(id));
                return { user, subscribedToUser, userSubscribedTo };
              });
              return result;
            },
          },
        },
      });

      const mutation = new GraphQLObjectType({
        name: "Mutation",
        description: "This is the root mutation",
        fields: {
          createUser: {
            type: createUserType,
            args: {
              firstName: { type: GraphQLString },
              lastName: { type: GraphQLString },
              email: { type: GraphQLString },
            },
            async resolve(parent, args, context) {
              return await fastify.db.users.create({ ...args });
            },
          },
        },
      });

      const schema = new GraphQLSchema({
        query: rootQuery,
        mutation: mutation,
        types: [memberTypeType, profileType, postType, userType],
      });

      return await graphql({
        schema,
        source: String(request.body.query),
        variableValues: request.body.variables,
        // contextValue: fastify,
      });
    }
  );
};

export default plugin;
