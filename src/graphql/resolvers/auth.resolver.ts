import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { MeResponse } from "../responses/auth/me-response.type";
import { RegisterInput } from "../inputs/auth/register.input";
import prisma from "src/database/prisma";
import { AppContext } from "src/types/app-context";
import { getUserFromHeaders } from "src/utils/get-user-from-headers";
import * as bcrypt from "bcrypt";
import { env } from "src/env";
import { LoginResponse } from "../responses/auth/login-response.type";
import { LoginInput } from "../inputs/auth/login.input";
import { UserRoleEnum } from "src/types/user-role";
import { InvalidCredentialsError } from "src/errors/invalid-credentials";
import { createAccessToken } from "src/utils/jwt";
import { User } from "../entities/user";
import { ForbiddenException, Logger } from "@nestjs/common";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { RegisterAlreadyExistsError } from "src/errors/register-already-exists";

@Resolver()
export class AuthResolver {
  @Query(() => MeResponse, { nullable: false })
  async me(@Context() ctx: AppContext): Promise<MeResponse> {
    const user = await getUserFromHeaders(ctx.request.headers);

    if (user) return user as MeResponse;
    else throw new ForbiddenException();
  }

  @Mutation(() => LoginResponse, { nullable: false })
  async login(
    @Args("input", { type: () => LoginInput, nullable: false })
    input: LoginInput,
  ): Promise<LoginResponse> {
    let users: Array<User>;

    if (input.role === UserRoleEnum.student) {
      users = await prisma.student.findMany({
        where: {
          username: input.username,
        },
      });
    } else if (input.role === UserRoleEnum.teacher) {
      users = await prisma.teacher.findMany({
        where: {
          username: input.username,
        },
      });
    }

    if (users.length < 1) throw new InvalidCredentialsError();

    const valid = bcrypt.compareSync(input.password, users[0].password);

    if (valid) {
      return {
        token: createAccessToken(users[0].id, input.role),
      } as LoginResponse;
    } else throw new InvalidCredentialsError();
  }

  @Mutation(() => MeResponse, { nullable: false })
  async registerUser(
    @Args("input", { type: () => RegisterInput, nullable: false })
    input: RegisterInput,
  ): Promise<MeResponse> {
    try {
      if (input.role === "student") return await this.#registerStudent(input);
      else if (input.role === "teacher")
        return await this.#registerTeacher(input);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new RegisterAlreadyExistsError(`${input.role} user`);
        }
      }
      throw err;
    }
  }

  async #registerStudent(input: RegisterInput): Promise<MeResponse> {
    const { created_at, id, name, username } = await prisma.student.create({
      data: {
        name: input.name,
        username: input.username,
        password: await bcrypt.hash(input.password, Number(env.SALT_OR_ROUNDS)),
      },
    });

    const response = {
      created_at,
      id,
      name,
      username,
      role: "student",
    } as MeResponse;

    return response as MeResponse;
  }

  async #registerTeacher(input: RegisterInput): Promise<MeResponse> {
    const { created_at, id, name, username } = await prisma.teacher.create({
      data: {
        name: input.name,
        username: input.username,
        password: await bcrypt.hash(input.password, Number(env.SALT_OR_ROUNDS)),
      },
    });

    const response = {
      created_at,
      id,
      name,
      username,
      role: "teacher",
    };

    return response as MeResponse;
  }
}
