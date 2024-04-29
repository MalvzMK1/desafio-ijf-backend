import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CreateCourseInput } from "src/graphql/inputs/course/create-course.input";

@ObjectType()
export class CreateCourseResponse extends CreateCourseInput {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => Date, { nullable: false })
  created_at: Date;
}
