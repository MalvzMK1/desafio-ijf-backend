import { Entity } from "./base-entity";
import { Lesson } from "./lesson";
import { Student } from "./student";

export interface StudentLessonProps {
  student: Student;
  lesson: Lesson;
  watched?: boolean;
}

export class StudentLesson extends Entity<StudentLessonProps> {
  constructor(props: StudentLessonProps) {
    super({
      ...props,
      watched: props.watched || false,
    });
  }

  watch(): void {
    this.props.watched = true;
  }
}
