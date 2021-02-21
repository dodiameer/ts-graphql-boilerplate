import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User.entity";
import { RegisterUserInput } from "../inputTypes/RegisterUser.input";
import { MyContext } from "../types/MyContext";
import argon2 from "argon2";

@Resolver()
export class UserResolver {
  @Query((returns) => [User])
  async allUsers(@Ctx() { userRepo }: MyContext) {
    return await userRepo().findAll();
  }

  @Query((returns) => User)
  async me(@Ctx() { getSessionUser }: MyContext) {
    const user = await getSessionUser();
    if (!user) {
      throw new Error("Not logged in!");
    }
    return user;
  }

  @Mutation((returns) => User)
  async register(
    @Ctx() { userRepo, session }: MyContext,
    @Arg("input") input: RegisterUserInput
  ) {
    const repo = userRepo();
    const user = repo.create({
      ...input,
      password: await argon2.hash(input.password),
    });
    try {
      await repo.persistAndFlush(user);
    } catch (e) {
      if (e.name === "UniqueConstraintViolationException") {
        throw new Error("Email or username already in use!");
      }
      throw e;
    }
    session.userId = user.id;
    return user;
  }

  @Mutation((returns) => User)
  async login(
    @Ctx() { userRepo, session }: MyContext,
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    if (session.userId) {
      throw new Error("Already logged in!");
    }
    const repo = userRepo();
    const user = await repo.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error("Password incorrect");
    }

    session.userId = user.id;
    return user;
  }

  @Mutation((returns) => Boolean)
  async logout(@Ctx() { session }: MyContext) {
    let ok = true;
    session.destroy((e) => {
      if (e) {
        console.error("[LOGOUT ERROR]", e);
        ok = false;
      }
    });
    return true;
  }
}
