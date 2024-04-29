import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CreateLessonInput {
  @Field(() => String, { nullable: false })
  content: string;

  @Field(() => ID, { nullable: false })
  courseId: string;
}
