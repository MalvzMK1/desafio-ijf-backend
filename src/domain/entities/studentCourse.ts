import { CannotApproveStudentError } from "src/errors/cannot-approve-student";
import { Entity } from "./base-entity";
import { Course } from "./course";
import { Student } from "./student";

export type StudentCourseStatus =
  | "notStarted"
  | "inProgress"
  | "finished"
  | "approved";

export interface StudentCourseProps {
  student: Student;
  course: Course;
  status?: StudentCourseStatus;
}

export class StudentCourse extends Entity<StudentCourseProps> {
  constructor(props: StudentCourseProps) {
    super({
      ...props,
      status: props.status || "notStarted",
    });
  }

  updateStatus(): void {
    const { lessons } = this.props.student.props;
    let newStatus: StudentCourseStatus;
    let watchedLessons = 0;

    for (const lesson of lessons) {
      if (lesson.props.watched) watchedLessons += 1;
    }

    if (watchedLessons < 1) {
      newStatus = "notStarted";
    } else if (watchedLessons > 0 && watchedLessons < lessons.length) {
      newStatus = "inProgress";
    } else {
      newStatus = "finished";
    }

    this.props.status = newStatus;
  }

  approve(): void {
    if (this.props.status === "finished") this.props.status = "approved";
    else throw new CannotApproveStudentError();
  }
}
