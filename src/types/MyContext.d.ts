import { EntityRepository } from "@mikro-orm/core";
import { User } from "../entities/User.entity";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

declare interface MyContext {
  userRepo: () => EntityRepository<User>;
  session: session.Session & Partial<session.SessionData>;
  getSessionUser: () => Promise<User | null>;
}
