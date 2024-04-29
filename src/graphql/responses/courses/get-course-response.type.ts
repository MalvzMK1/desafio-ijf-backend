import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Lesson } from "src/graphql/entities/lesson";

@ObjectType()
class GetCourseResponseTeacher {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: false })
  name?: string;

  @Field(() => String, { nullable: false })
  username?: string;
}

@ObjectType()
class GetCourseResponseStudentLessons {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => ID, { nullable: false })
  studentId?: string;

  @Field(() => ID, { nullable: false })
  lessonId?: string;

  @Field(() => Boolean, { nullable: false })
  watched?: boolean;
}

@ObjectType()
class GetCourseResponseStudent {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: false })
  name?: string;

  @Field(() => String, { nullable: false })
  username?: string;

  @Field(() => [GetCourseResponseStudentLessons])
  studentLessons?: Array<GetCourseResponseStudentLessons>;
}

@ObjectType()
class GetCourseResponseStudentCourse {
  @Field(() => GetCourseResponseStudent, { nullable: false })
  student?: GetCourseResponseStudent;

  @Field(() => ID, { nullable: false })
  courseId?: string;

  @Field(() => String, { nullable: false })
  status?: string;
}

@ObjectType()
export class GetCourseResponse {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => GetCourseResponseTeacher, { nullable: false })
  teacher?: GetCourseResponseTeacher;

  @Field(() => String, { nullable: false })
  name?: string;

  @Field(() => String, { nullable: false })
  description?: string;

  @Field(() => String, { nullable: false })
  banner?: string;

  @Field(() => [Lesson])
  lessons?: Array<Partial<Lesson>>;

  @Field(() => [GetCourseResponseStudentCourse])
  studentCourses?: Array<GetCourseResponseStudentCourse>;
}
