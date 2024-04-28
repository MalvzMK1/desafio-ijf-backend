import { CannotCreateError } from "src/errors/cannot-create";
import { Entity } from "./base-entity";
import { Student } from "./student";
import { Teacher } from "./teacher";

export interface CourseProps {
  teacher: Teacher;
  name: string;
  description: string;
  banner: string; // TODO: implement blob
  students?: Array<Student>;
}

export class Course extends Entity<CourseProps> {
  constructor(props: CourseProps) {
    super({
      ...props,
      students: props.students || [],
    });
  }

  edit(data: Partial<Omit<CourseProps, "teacher">>) {
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
}
