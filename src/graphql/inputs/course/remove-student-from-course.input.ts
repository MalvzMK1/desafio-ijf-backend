import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class RemoveStudentFromCourseInput {
  @Field(() => ID, { nullable: false })
  studentId: string;

  @Field(() => ID, { nullable: false })
  courseId: string;
}
