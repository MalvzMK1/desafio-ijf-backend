import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user";
import { Course } from "./course";

@ObjectType()
export class Teacher extends User {
  @Field(() => [Course], { nullable: false })
  courses: Array<Course>;
}
