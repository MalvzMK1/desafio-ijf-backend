import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { UserRoleEnum } from "src/types/user-role";

@InputType()
export class LoginInput {
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
