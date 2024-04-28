import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/graphql/entities/base-entity";
import { UserRole, UserRoleEnum } from "src/types/user-role";

@ObjectType()
export class MeResponse extends BaseEntity {
  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => UserRoleEnum, { nullable: false })
  role: UserRole;
}
