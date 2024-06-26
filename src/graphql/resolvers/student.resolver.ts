import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseAuthGuard } from "src/guards/auth.guard";
import { ApproveStudentResponse } from "../responses/student/approve-student-response.type";
import { ApproveStudentInput } from "../inputs/student/approve-student.input";
import prisma from "src/database/prisma";
import { CannotApproveStudentError } from "src/errors/cannot-approve-student";
import { FetchStudentsResponse } from "../responses/student/fetch-students-response.type";

@Resolver()
export class StudentResolver {
  @UseAuthGuard(["teacher"])
  @Mutation(() => ApproveStudentResponse)
  async approveStudent(
    @Args("input", { type: () => ApproveStudentInput, nullable: false })
    input: ApproveStudentInput,
  ): Promise<ApproveStudentResponse> {
    const studentCourse = await prisma.studentCourse.findUnique({
      where: {
        id: input.id,
      },
    });

    if (studentCourse.status === "finished") {
      const updatedStudentCourse = await prisma.studentCourse.update({
        where: {
          id: studentCourse.id,
        },
        data: {
          status: "approved",
        },
      });

      return updatedStudentCourse;
    } else {
      throw new CannotApproveStudentError();
    }
  }

  @UseAuthGuard(["teacher"])
  @Query(() => FetchStudentsResponse)
  async fetchStudents(): Promise<FetchStudentsResponse> {
    const students = await prisma.student.findMany({
      include: {
        studentCourses: {
          include: {
            course: true,
          },
        },
      },
    });

    return { students };
  }
}
