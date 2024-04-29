import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Lesson } from "../entities/lesson";
import { CreateLessonInput } from "../inputs/lesson/create-lesson.input";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";
import { GetLessonResponse } from "../responses/lesson/get-lesson-response.type";
import { WatchLessonInput } from "../inputs/lesson/watch-lesson.input";
import { AppContext } from "src/types/app-context";

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

  @UseAuthGuard(["student"])
  @Mutation(() => GetLessonResponse)
  async watchLesson(
    @Args("input", { type: () => WatchLessonInput, nullable: false })
    input: WatchLessonInput,
  ): Promise<GetLessonResponse> {
    const lesson = prisma.studentLesson.update({
      where: {
        id: input.id,
      },
      data: {
        watched: true,
      },
      select: {
        id: true,
        lesson: {
          select: {
            id: true,
            content: true,
          },
        },
        watched: true,
      },
    });

    return lesson;
  }
}
