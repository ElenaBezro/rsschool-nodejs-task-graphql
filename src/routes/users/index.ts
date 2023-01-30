import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";
import { validate } from "uuid";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (!validate(request.params.id)) {
        reply.statusCode = 404;
        throw new Error("Invalid id");
      }

      const user = await fastify.db.users.findOne({ key: "id", equals: request.params.id });
      if (!user) {
        reply.statusCode = 404;
        throw new Error("Not exist");
      }
      return user;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: "id", equals: request.params.id });

      if (!user) {
        reply.statusCode = 400;
        throw new Error("Not exist");
      }

      const unsubscribeFromAllUsers = async () => {
        const users = await fastify.db.users.findMany();
        const subscribedToUsers = users.filter((user) => user.subscribedToUserIds.includes(request.params.id));
        if (subscribedToUsers) {
          return Promise.all(subscribedToUsers.map((user) => fastify.db.users.change(user.id, { subscribedToUserIds: user.subscribedToUserIds.filter((userId) => userId != request.params.id) })));
        }
      };
      await unsubscribeFromAllUsers();
      console.log("after unsubscribeFromAllUsers");

      const deleteUserPosts = async () => {
        const posts = await fastify.db.posts.findMany();

        const allUserPosts = posts.filter((post) => post.userId === request.params.id);
        if (allUserPosts) {
          return Promise.all(allUserPosts.map((post) => fastify.db.posts.delete(post.id)));
        }
      };
      await deleteUserPosts();
      console.log("after deleteUserPosts");

      const deleteUserProfiles = async () => {
        const profiles = await fastify.db.profiles.findMany();

        const allUserPosts = profiles.filter((profile) => profile.userId === request.params.id);
        if (allUserPosts) {
          return Promise.all(allUserPosts.map((profile) => fastify.db.profiles.delete(profile.id)));
        }
      };
      await deleteUserProfiles();
      console.log("after deleteUserProfiles");

      console.log("deleting user by id:", request.params.id);
      return await fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { userId } = request.body;
      let userBlogger = await fastify.db.users.findOne({ key: "id", equals: userId });
      if (userBlogger && !userBlogger.subscribedToUserIds.includes(request.params.id)) {
        userBlogger = await fastify.db.users.change(userId, {
          subscribedToUserIds: [...userBlogger.subscribedToUserIds, request.params.id],
        });
      }

      return userBlogger!;
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { userId } = request.body;
      let userBlogger = await fastify.db.users.findOne({ key: "id", equals: userId });
      if (!userBlogger?.subscribedToUserIds.includes(userId)) {
        reply.statusCode = 400;
      }
      if (userBlogger && userBlogger.subscribedToUserIds.includes(request.params.id)) {
        userBlogger = await fastify.db.users.change(userId, { subscribedToUserIds: [...userBlogger.subscribedToUserIds.filter((userIdToFilter) => userIdToFilter !== request.params.id)] });
      }
      return userBlogger!;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: "id", equals: request.params.id });

      if (!user) {
        reply.statusCode = 400;
        throw new Error("Not exist");
      }
      const newUser = await fastify.db.users.change(request.params.id, { firstName: request.body.firstName, lastName: request.body.lastName, email: request.body.email });
      return newUser;
    }
  );
};

export default plugin;
