import { MikroORM } from "@mikro-orm/core";
import dotenv from "dotenv";
import { User } from "../src/entities/User.entity";
dotenv.config();

const MikroORMConfig: Parameters<typeof MikroORM.init>[0] = {
  type: "postgresql",
  clientUrl: process.env.DATABASE_URL,
  entities: [User],
};

export default MikroORMConfig;
