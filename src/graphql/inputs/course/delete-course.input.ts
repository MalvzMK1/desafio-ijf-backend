import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteCourseInput {
  @Field(() => ID, { nullable: false })
  id: string;
}
