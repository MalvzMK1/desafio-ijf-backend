import { ArgsType } from "@nestjs/graphql";
import { Field } from "@nestjs/graphql/dist";

enum UserRoleEnum {
  student,
  teacher,
}

@ArgsType()
export class RegisterInput {
  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => UserRoleEnum, { nullable: false })
  role: UserRoleEnum;
}
