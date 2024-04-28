import { CannotCreateError } from "src/errors/cannot-create";
import { Entity } from "./base-entity";
import { Student } from "./student";
import { Teacher } from "./teacher";
import { NotFoundError } from "src/errors/not-found-error";
import { Lesson } from "./lesson";

export interface CourseProps {
  teacher: Teacher;
  name: string;
  description: string;
  banner: string; // TODO: implement blob
  students?: Array<Student>;
  lessons: Array<Lesson>;
}

export class Course extends Entity<CourseProps> {
  constructor(props: CourseProps) {
    if (props.lessons.length < 1)
      throw new CannotCreateError(
        "It's not possible to create a course without a lesson",
      );
    super({
      ...props,
      students: props.students || [],
    });
  }

  edit(data: Partial<Omit<CourseProps, "teacher">>): void {
    this.props = { ...this.props, ...data };
  }

  addStudent(student: Student): void {
    const existentStudentIdx = this.props.students.findIndex(
      (item) => item.props.username === student.props.username,
    );

    if (existentStudentIdx > -1)
      throw new CannotCreateError("Student already exists");

    this.props.students.push(student);
  }

  removeStudent(studentId: Student["id"]): void {
    const foundStudentIdx = this.props.students.findIndex(
      (item) => item.id === studentId,
    );

    if (foundStudentIdx < 0) throw new NotFoundError();

    this.props.students.splice(foundStudentIdx, 1);
  }

  addLesson(lesson: Lesson): void {
    this.props.lessons.push(lesson);
  }

  removeLesson(lessonId: Lesson["id"]): void {
    const foundLessonIdx = this.props.lessons.findIndex(
      (item) => item.id === lessonId,
    );

    if (foundLessonIdx < 0) throw new NotFoundError();

    this.props.lessons.splice(foundLessonIdx, 1);
  }
}
