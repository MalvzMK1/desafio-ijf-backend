import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RemoveStudentFromCourseResponse {
  @Field(() => String, { nullable: false })
  message: string;
}
