import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { MeResponse } from "../responses/auth/me-response.type";
import { RegisterInput } from "../inputs/auth/register.input";
import prisma from "src/database/prisma";
import { AppContext } from "src/types/app-context";
import { getUserFromHeaders } from "src/utils/get-user-from-headers";
import * as bcrypt from "bcrypt";
import { env } from "src/env";

@Resolver()
export class AuthResolver {
  @Query(() => MeResponse, { nullable: false })
  async me(@Context() ctx: AppContext): Promise<MeResponse> {
    const user = await getUserFromHeaders(ctx.request.headers);

    return user as MeResponse;
  }

  @Mutation(() => MeResponse, { nullable: false })
  registerUser(
    @Args("input", { type: () => RegisterInput, nullable: false })
    input: RegisterInput,
  ): Promise<MeResponse> {
    if (input.role === "student") return this.#registerStudent(input);
    else if (input.role === "teacher") return this.#registerTeacher(input);
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
      role: "teacher",
    };

    return response as MeResponse;
  }
}
