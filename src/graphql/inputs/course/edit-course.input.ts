import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class EditCourseInput {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  banner?: string;
}
