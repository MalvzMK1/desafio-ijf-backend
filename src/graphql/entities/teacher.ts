import { ObjectType } from "@nestjs/graphql";
import { User } from "./user";

@ObjectType()
export class Teacher extends User {
  // @Field(() => [Course], { nullable: false })
  // courses: Array<Course>;
}
