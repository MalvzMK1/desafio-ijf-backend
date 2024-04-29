import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
class FetchStudentsResponseStudentCourseCourse {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  description: string;
}

@ObjectType()
class FetchStudentsResponseStudentCourse {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => ID, { nullable: false })
  courseId: string;

  @Field(() => FetchStudentsResponseStudentCourseCourse, { nullable: false })
  course: FetchStudentsResponseStudentCourseCourse;
}

@ObjectType()
class FetchStudentsResponseStudent {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => [FetchStudentsResponseStudentCourse], { nullable: false })
  studentCourses: Array<FetchStudentsResponseStudentCourse>;
}

@ObjectType()
export class FetchStudentsResponse {
  @Field(() => [FetchStudentsResponseStudent], { nullable: false })
  students: Array<FetchStudentsResponseStudent>;
}
