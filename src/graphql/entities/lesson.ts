import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";
import { StudentLesson } from "./student-lesson";

@ObjectType()
export class Lesson extends BaseEntity {
  @Field(() => String, { nullable: false })
  content: string;

  @Field(() => [StudentLesson])
  studentLessons: Array<StudentLesson>;
}
