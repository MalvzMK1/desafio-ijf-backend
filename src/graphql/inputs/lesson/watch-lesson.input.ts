import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class WatchLessonInput {
  @Field(() => ID, { nullable: false })
  lessonId: string;
}
