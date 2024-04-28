import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";
import { Teacher } from "src/domain/entities/teacher";
import { StudentCourse } from "./student-course";

@ObjectType()
export class Course extends BaseEntity {
  @Field(() => ID, { nullable: false })
  teacherId: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => String, { nullable: false })
  banner: string;

  @Field(() => Teacher)
  teacher: Teacher;

  @Field(() => [StudentCourse])
  studentCourses: Array<StudentCourse>;
}
