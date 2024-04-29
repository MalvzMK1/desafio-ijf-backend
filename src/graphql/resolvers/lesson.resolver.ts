import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Lesson } from "../entities/lesson";
import { CreateLessonInput } from "../inputs/lesson/create-lesson.input";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";
import { GetLessonResponse } from "../responses/lesson/get-lesson-response.type";
import { WatchLessonInput } from "../inputs/lesson/watch-lesson.input";
import { StudentCourseStatus } from "src/domain/entities/studentCourse";
import { AppContext } from "src/types/app-context";
import { NotFoundError } from "src/errors/not-found-error";

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
    @Context()
    ctx: AppContext,
  ): Promise<GetLessonResponse> {
    const { id: userId } = ctx.user;

    const allStudentLessons = await prisma.studentLesson.findMany({
      where: {
        lessonId: input.lessonId,
      },
    });

    const studentLesson = allStudentLessons.find(
      (item) => item.studentId === userId,
    );

    if (!studentLesson) throw new NotFoundError();

    const updatedStudentLesson = await prisma.studentLesson.update({
      where: {
        id: studentLesson.id,
      },
      data: {
        watched: true,
      },
      select: {
        id: true,
        watched: true,
        lesson: {
          select: {
            id: true,
            content: true,
            Course: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const { id: courseId } = updatedStudentLesson.lesson.Course;

    this.validateCourseStatus(userId, courseId);

    return updatedStudentLesson;
  }

  async validateCourseStatus(
    studentId: string,
    courseId: string,
  ): Promise<void> {
    const studentsCourses = await prisma.studentCourse.findMany({
      where: {
        courseId,
      },
      include: {
        course: {
          include: {
            lessons: {
              include: {
                studentLessons: {
                  where: {
                    studentId,
                  },
                  select: {
                    watched: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let studentCourse: (typeof studentsCourses)[0];

    for (const studentCourses of studentsCourses) {
      if (studentCourses.studentId === studentId)
        studentCourse = studentCourses;
    }

    if (!studentCourse) return;

    const { lessons } = studentCourse.course;
    let watchedLessons = 0;
    let newStatus: StudentCourseStatus = "notStarted";

    for (const lesson of lessons) {
      if (lesson.studentLessons[0].watched) watchedLessons += 1;
    }

    if (watchedLessons > 0 && watchedLessons < lessons.length) {
      newStatus = "inProgress";
    }
    if (watchedLessons === lessons.length) {
      newStatus = "finished";
    }

    if (newStatus !== studentCourse.status) {
      await prisma.studentCourse.update({
        where: {
          id: studentCourse.id,
        },
        data: {
          status: newStatus,
        },
      });
    }
  }
}
