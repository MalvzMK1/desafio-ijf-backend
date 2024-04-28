import { Context, Query, Resolver } from "@nestjs/graphql";
import { Course } from "../entities/course";
import { AppContext } from "src/types/app-context";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";
import { Logger } from "@nestjs/common";

@Resolver()
export class CourseResolver {
  @UseAuthGuard()
  @Query(() => [Course], { nullable: false })
  async fetchCourses(@Context() ctx: AppContext): Promise<Array<Course>> {
    const { role, id } = ctx.user;
    Logger.log(role);
    Logger.log(id);
    let courses: Array<Course> = [];

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
          studentCourses: {
            include: {
              course: {
                include: {
                  studentCourses: true,
                  teacher: true,
                },
              },
              student: {
                include: {
                  studentCourses: true,
                  studentLessons: true,
                },
              },
            },
          },
          teacher: true,
        },
      });
    } else {
      courses = await prisma.course.findMany({
        include: {
          teacher: true,
          studentCourses: {
            include: {
              student: {
                include: {
                  studentCourses: {
                    include: {
                      student: true,
                      course: true,
                    },
                  },
                  studentLessons: {
                    include: {
                      student: true,
                      lesson: true,
                    },
                  },
                },
              },
              course: {
                include: {
                  studentCourses: {
                    include: {
                      student: true,
                      course: true,
                    },
                  },
                  teacher: true,
                },
              },
            },
          },
        },
      });
    }

    return courses;
  }
}
