import { Field, ID, InputType } from "@nestjs/graphql";
import { Teacher } from "src/graphql/entities/teacher";

@InputType()
class LessonInput {
  @Field(() => String, { nullable: false })
  content: string;
}

@InputType()
export class CreateCourseInput {
  @Field(() => ID, { nullable: false })
  teacherId: Teacher["id"];

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => String, { nullable: false })
  banner: string;

  @Field(() => [LessonInput])
  lessons: LessonInput[];
}
