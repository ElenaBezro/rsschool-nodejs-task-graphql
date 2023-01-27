import { validate } from "uuid";
import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (typeof request.params.id !== "string") {
        reply.statusCode = 400;
        throw new Error("Invalid id");
      }
      const profile = await fastify.db.profiles.findOne({ key: "id", equals: request.params.id });
      if (profile) {
        return profile;
      }

      reply.statusCode = 404;
      throw new Error("Not exist");
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { userId, memberTypeId } = request.body;

      if (!validate(userId)) {
        reply.statusCode = 400;
        throw new Error("Invalid user id");
      }
      const user = await fastify.db.users.findOne({ key: "id", equals: userId });

      if (!user) {
        reply.statusCode = 400;
        throw new Error(`User with userId = ${userId} does not exist`);
      }

      const profile = await fastify.db.profiles.findOne({ key: "userId", equals: userId });

      if (profile) {
        reply.statusCode = 400;
        throw new Error("User already has a profile");
      }

      const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });

      if (!memberType) {
        reply.statusCode = 400;
        throw new Error(`Member type = ${memberTypeId} does not exist`);
      }

      const newProfile = await fastify.db.profiles.create(request.body);
      return newProfile;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: "id", equals: request.params.id });
      if (!profile) {
        reply.statusCode = 400;
        throw new Error("Not exist");
      }

      return await fastify.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: "id", equals: request.params.id });
      if (!profile) {
        reply.statusCode = 400;
        throw new Error("Not exist");
      }

      const { avatar, sex, birthday, country, street, city, memberTypeId } = request.body;
      // const changes = Object.entries({ avatar, sex, birthday, country, street, city, memberTypeId }).reduce((acc, [key, value]) => (value !== undefined ? { ...acc, [key]: value } : acc), {});
      // return await fastify.db.profiles.change(request.params.id, changes);
      return await fastify.db.profiles.change(request.params.id, { avatar, sex, birthday, country, street, city, memberTypeId });
    }
  );
};

export default plugin;
