import { Field, ObjectType } from "@nestjs/graphql";
import { Course } from "src/graphql/entities/course";

@ObjectType()
export class FetchCoursesResponse {
  @Field(() => [Course], { nullable: false })
  courses: Array<Course>;
}
