import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

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
      const user = await fastify.db.users.findOne({ key: "id", equals: request.params.id });
      return user!;
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
      return await fastify.db.users.delete(request.id);
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
      let user = await fastify.db.users.findOne(request.id);
      if (user && !user.subscribedToUserIds.includes(userId)) {
        user = await fastify.db.users.change(request.id, {
          subscribedToUserIds: [...user.subscribedToUserIds, userId],
        });
      }

      return user!;
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
      let user = await fastify.db.users.findOne(request.id);
      if (user && user.subscribedToUserIds.includes(userId)) {
        user = await fastify.db.users.change(request.id, { subscribedToUserIds: [...user.subscribedToUserIds.filter((userIdToFilter) => userIdToFilter !== userId)] });
      }
      return user!;

      //return await
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
      const user = await fastify.db.users.change(JSON.stringify({ firstName: request.body.firstName, lastName: request.body.lastName, email: request.body.email }), request.id);
      return user;
    }
  );
};

export default plugin;
