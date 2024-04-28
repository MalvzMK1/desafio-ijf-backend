import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";
import { Student } from "./student";
import { Course } from "./course";
import { StudentCourseStatus } from "src/domain/entities/studentCourse";
import { StudentCourseStatusEnum } from "src/types/student-course-status.enum";

@ObjectType()
export class StudentCourse extends BaseEntity {
  @Field(() => ID, { nullable: false })
  studentId: Student["id"];

  @Field(() => ID, { nullable: false })
  courseId: Course["id"];

  @Field(() => Student, { nullable: false })
  student: Student;

  @Field(() => Course, { nullable: false })
  course: Course;

  @Field(() => StudentCourseStatusEnum, { nullable: false })
  status: StudentCourseStatus;
}
