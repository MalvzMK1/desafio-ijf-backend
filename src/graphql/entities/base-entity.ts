import { Field, ID, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export abstract class BaseEntity {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => Date, { nullable: false })
  created_at: Date;
}
