import { InputType, registerEnumType } from "@nestjs/graphql";
import { Field } from "@nestjs/graphql/dist";
import { UserRoleEnum } from "src/types/user-role";

@InputType()
export class RegisterInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => UserRoleEnum, { nullable: false })
  role: UserRoleEnum;
}
registerEnumType(UserRoleEnum, {
  name: "UserRole",
});
