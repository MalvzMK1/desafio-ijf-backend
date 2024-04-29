import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
class GetCourseResponseTeacher {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  username: string;
}

@ObjectType()
class GetCourseResponseStudent {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  username: string;
}

@ObjectType()
class GetCourseResponseStudentCourse {
  @Field(() => GetCourseResponseStudent, { nullable: false })
  student: GetCourseResponseStudent;

  @Field(() => ID, { nullable: false })
  courseId: string;

  @Field(() => String, { nullable: false })
  status: string;
}

@ObjectType()
export class GetCourseResponse {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => GetCourseResponseTeacher, { nullable: false })
  teacher: GetCourseResponseTeacher;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => String, { nullable: false })
  banner: string;

  @Field(() => [GetCourseResponseStudentCourse])
  studentCourses: Array<GetCourseResponseStudentCourse>;
}
