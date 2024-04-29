import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetLessonResponseStudentLesson {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  content: string;
}

@ObjectType()
export class GetLessonResponse {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => GetLessonResponseStudentLesson)
  lesson: GetLessonResponseStudentLesson;

  @Field(() => Boolean, { nullable: false })
  watched: boolean;
}
