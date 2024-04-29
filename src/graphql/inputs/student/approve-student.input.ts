import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ApproveStudentInput {
  @Field(() => String, { nullable: false })
  id: string;
}
