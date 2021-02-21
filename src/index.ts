import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { User } from "./entities/User.entity";
import { UserResolver } from "./resolvers/User.resolver";
import { MyContext } from "./types/MyContext";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";

dotenv.config();

const main = async () => {
  const orm = await MikroORM.init();
  await orm.getMigrator().up();

  let RedisStore = connectRedis(session);
  let redisClient = redis.createClient();

  const app = express();

  app.use(
    session({
      name: "iarsid",
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
      },
    })
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => {
      const ctx: MyContext = {
        userRepo: () => orm.em.getRepository(User),
        session: req.session,
        getSessionUser: async () => {
          if (req.session.userId) {
            return await orm.em
              .getRepository(User)
              .findOne({ id: req.session.userId });
          }
          return null;
        },
      };
      return ctx;
    },
  });
  const path = process.env.API_PATH;
  server.applyMiddleware({ app, path });

  app.listen(process.env.PORT, () => {
    console.log(`🏆 http://localhost:${process.env.PORT}${path}`);
  });
};

main().catch((e) => {
  console.log("[Uncaught Error]", e);
});
