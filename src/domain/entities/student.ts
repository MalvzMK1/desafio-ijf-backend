import { NotFoundError } from "src/errors/not-found-error";
import { Entity } from "./base-entity";
import { Course } from "./course";
import { Lesson } from "./lesson";
import { StudentLesson } from "./studentLesson";
import { StudentCourse, StudentCourseStatus } from "./studentCourse";

interface StudentProps {
  name: string;
  username: string;
  password: string;
}

export interface StudentConstructorProps extends StudentProps {
  courses?: Array<Course>;
}

export interface StudentEntityProps extends StudentProps {
  courses: Array<StudentCourse>;
  lessons: Array<StudentLesson>;
}

export class Student extends Entity<StudentEntityProps> {
  constructor(props: StudentConstructorProps) {
    super({
      ...props,
      lessons: [],
      courses: [],
    });

    this.#loadStudentCourseLessonData(props.courses);
  }

  #loadStudentCourseLessonData(
    courses: StudentConstructorProps["courses"],
  ): void {
    this.#loadStudentLessons(courses);
    this.#loadStudentCourses(courses);
  }

  #loadStudentLessons(courses: StudentConstructorProps["courses"]): void {
    const studentLessons: Array<StudentLesson> = [];

    if (courses) {
      for (const course of courses) {
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

  #loadStudentCourses(courses: StudentConstructorProps["courses"]): void {
    const studentCourses: Array<StudentCourse> = [];

    if (courses) {
      for (const course of courses) {
        const newStudentCourse = new StudentCourse({
          course,
          student: this,
        });

        if (!studentCourses.includes(newStudentCourse))
          studentCourses.push(newStudentCourse);
      }
    }

    this.props.courses = studentCourses;
  }

  edit(props: Partial<StudentEntityProps>): void {
    this.props = { ...this.props, ...props };
  }

  addCourse(course: Course): void {
    const newStudentCourse = new StudentCourse({
      course,
      student: this,
    });

    if (this.props.courses) this.props.courses.push(newStudentCourse);
    else this.props.courses = [newStudentCourse];
  }

  toggleWatchedLessonStatus(lessonId: Lesson["id"]): void {
    const foundLessonIdx = this.props.lessons.findIndex(
      (studentLesson) => studentLesson.props.lesson.id === lessonId,
    );

    if (foundLessonIdx < 0) throw new NotFoundError();

    const lesson = this.props.lessons[foundLessonIdx];

    if (lesson.props.watched) lesson.props.watched = false;
    else lesson.toggleWatch();

    this.#updateCourseStatus(lessonId);
  }

  #updateCourseStatus(lessonId: StudentLesson["id"]): void {
    const foundCourseIdx = this.props.courses.findIndex(
      (course) =>
        !!course.props.course.props.lessons.find(
          (lesson) => lesson.id === lessonId,
        ),
    );

    if (foundCourseIdx < 0) throw new NotFoundError();

    this.props.courses[foundCourseIdx].updateStatus();
  }
}
