import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/graphql/entities/base-entity";
import { User } from "src/graphql/entities/user";

@ObjectType()
export class MeResponse extends BaseEntity {
  @Field(() => User, { nullable: false })
  me: User;
}
