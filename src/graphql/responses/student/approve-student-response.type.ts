import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ApproveStudentResponse {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => ID, { nullable: false })
  studentId: string;

  @Field(() => ID, { nullable: false })
  courseId: string;

  @Field(() => String, { nullable: false })
  status: string;
}
