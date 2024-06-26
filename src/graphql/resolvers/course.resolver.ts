import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Course } from "../entities/course";
import { AppContext } from "src/types/app-context";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";
import { CreateCourseInput } from "../inputs/course/create-course.input";
import { AddStudentToCourseInput } from "../inputs/course/add-student-to-course.input";
import { GetCourseResponse } from "../responses/courses/get-course-response.type";
import { EditCourseInput } from "../inputs/course/edit-course.input";
import { DeleteCourseInput } from "../inputs/course/delete-course.input";
import { RemoveStudentFromCourseInput } from "../inputs/course/remove-student-from-course.input";
import { RemoveStudentFromCourseResponse } from "../responses/courses/remove-user-response.type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RegisterAlreadyExistsError } from "src/errors/register-already-exists";
import { CannotUpdateError } from "src/errors/cannot-create-duplicate-infos";

@Resolver()
export class CourseResolver {
  @UseAuthGuard()
  @Query(() => [GetCourseResponse], { nullable: false })
  async fetchCourses(
    @Context() ctx: AppContext,
  ): Promise<Array<GetCourseResponse>> {
    const { role, id } = ctx.user;

    let courses: Array<GetCourseResponse> = [];

    if (role === "student") {
      courses = await prisma.course.findMany({
        where: {
          studentCourses: {
            some: {
              studentId: id,
            },
          },
        },
        include: {
          lessons: true,
          teacher: true,
          studentCourses: {
            where: {
              studentId: id,
            },
            include: {
              student: {
                include: {
                  studentLessons: {
                    where: {
                      studentId: id,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      courses = await prisma.course.findMany({
        include: {
          lessons: true,
          studentCourses: {
            include: {
              student: {
                include: {
                  studentLessons: {
                    select: {
                      id: true,
                      studentId: true,
                      lessonId: true,
                      watched: true,
                    },
                  },
                },
              },
            },
          },
          teacher: true,
        },
      });
    }

    return courses;
  }

  @UseAuthGuard(["teacher"])
  @Mutation(() => Course, { nullable: false })
  async createCourse(
    @Context() ctx: AppContext,
    @Args("input", { type: () => CreateCourseInput, nullable: false })
    input: CreateCourseInput,
  ): Promise<GetCourseResponse> {
    try {
      const course: GetCourseResponse = await prisma.course.create({
        data: {
          name: input.name,
          description: input.description,
          banner: input.banner,
          teacherId: ctx.user.id,
          lessons: {
            createMany: {
              data: input.lessons,
            },
          },
        },
        include: {
          teacher: true,
          studentCourses: {
            include: {
              student: true,
            },
          },
        },
      });

      return course;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new RegisterAlreadyExistsError("Course");
        }
      }
      throw err;
    }
  }

  @UseAuthGuard(["teacher"])
  @Mutation(() => GetCourseResponse, { nullable: false })
  async editCourse(
    @Args("input", { type: () => EditCourseInput, nullable: false })
    input: EditCourseInput,
  ): Promise<GetCourseResponse> {
    try {
      const courseCurrentData = await prisma.course.findUnique({
        where: {
          id: input.id,
        },
      });

      const course = await prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          ...courseCurrentData,
          ...input,
        },
        include: {
          teacher: true,
          studentCourses: {
            include: {
              student: true,
            },
          },
        },
      });

      return course;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new CannotUpdateError("duplicated data");
        }
      }
      throw err;
    }
  }

  @UseAuthGuard(["teacher"])
  @Mutation(() => GetCourseResponse)
  async deleteCourse(
    @Args("input", { type: () => DeleteCourseInput, nullable: false })
    input: DeleteCourseInput,
  ): Promise<GetCourseResponse> {
    return await prisma.course.delete({
      where: {
        id: input.id,
      },
      include: {
        teacher: true,
        studentCourses: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  @UseAuthGuard(["teacher"])
  @Mutation(() => GetCourseResponse, { nullable: false })
  async addStudentToCourse(
    @Args("input", { type: () => AddStudentToCourseInput, nullable: false })
    input: AddStudentToCourseInput,
  ): Promise<GetCourseResponse> {
    const course = (await prisma.course.update({
      where: {
        id: input.courseId,
      },
      data: {
        studentCourses: {
          create: {
            student: {
              connect: {
                id: input.studentId,
              },
            },
          },
        },
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        studentCourses: {
          select: {
            courseId: true,
            status: true,
            student: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    })) as GetCourseResponse;

    const { lessons } = await prisma.course.findUnique({
      where: {
        id: course.id,
      },
      include: {
        lessons: true,
      },
    });

    for (const lesson of lessons) {
      await prisma.studentLesson.create({
        data: {
          student: {
            connect: {
              id: input.studentId,
            },
          },
          lesson: {
            connect: {
              id: lesson.id,
            },
          },
        },
      });
    }

    return course;
  }

  @UseAuthGuard(["teacher"])
  @Mutation(() => RemoveStudentFromCourseResponse)
  async removeStudentFromCourse(
    @Args("input", {
      type: () => RemoveStudentFromCourseInput,
      nullable: false,
    })
    input: RemoveStudentFromCourseInput,
  ): Promise<RemoveStudentFromCourseResponse> {
    const allStudentsFromCourse = await prisma.studentCourse.findMany({
      where: {
        courseId: input.courseId,
      },
    });

    const studentCourse = allStudentsFromCourse.find(
      (item) => item.studentId === input.studentId,
    );

    await prisma.studentCourse.delete({
      where: {
        id: studentCourse.id,
      },
    });

    return {
      message: "Removed student from course successfully",
    };
  }
}
