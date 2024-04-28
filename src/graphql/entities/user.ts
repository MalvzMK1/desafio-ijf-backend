import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";

@ObjectType()
export abstract class User extends BaseEntity {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  username: string;
}
