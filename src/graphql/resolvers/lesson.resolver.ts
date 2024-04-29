import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Lesson } from "../entities/lesson";
import { CreateLessonInput } from "../inputs/lesson/create-lesson.input";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";

@Resolver()
export class LessonResolver {
  @UseAuthGuard(["teacher"])
  @Mutation(() => Lesson, { nullable: false })
  async createLesson(
    @Args("input", { type: () => CreateLessonInput, nullable: false })
    input: CreateLessonInput,
  ): Promise<Lesson> {
    const lesson = await prisma.lesson.create({
      data: {
        content: input.content,
        courseId: input.courseId,
      },
      include: {
        studentLessons: true,
      },
    });

    return {
      content: lesson.content,
      created_at: lesson.created_at,
      id: lesson.id,
      studentLessons: lesson.studentLessons,
    } as Lesson;
  }
}
