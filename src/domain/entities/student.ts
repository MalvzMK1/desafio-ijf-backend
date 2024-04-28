import { NotFoundError } from "src/errors/not-found-error";
import { Entity } from "./base-entity";
import { Course } from "./course";
import { Lesson } from "./lesson";
import { StudentLesson } from "./studentLesson";

export interface StudentProps {
  name: string;
  username: string;
  password: string;
  courses?: Array<Course>;
}

export class Student extends Entity<
  StudentProps & { lessons: Array<StudentLesson> }
> {
  constructor(props: StudentProps) {
    super({
      ...props,
      lessons: [],
    });

    const studentLessons: Array<StudentLesson> = [];

    if (props.courses) {
      for (const course of props.courses) {
        for (const lesson of course.props.lessons) {
          const newStudentLesson = new StudentLesson({
            lesson,
            student: this,
          });

          if (!studentLessons.includes(newStudentLesson))
            studentLessons.push(newStudentLesson);
        }
      }
    }

    this.props.lessons = studentLessons;
  }

  edit(props: Partial<StudentProps>): void {
    this.props = { ...this.props, ...props };
  }

  addCourse(course: Course): void {
    if (this.props.courses) this.props.courses.push(course);
    else this.props.courses = [course];
  }

  watchLesson(lessonId: Lesson["id"]): void {
    const foundLessonIdx = this.props.lessons.findIndex(
      (studentLesson) => studentLesson.props.lesson.id === lessonId,
    );

    if (foundLessonIdx < 0) throw new NotFoundError();

    this.props.lessons[foundLessonIdx].watch();
  }
}
