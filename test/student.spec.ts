import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { Teacher } from "src/domain/entities/teacher";
import { CannotApproveStudentError } from "src/errors/cannot-approve-student";
import { describe, it, expect } from "vitest";

describe("Student tests", () => {
  it("should be possible to see student courses' and lessons' status", () => {
    const lesson1 = new Lesson({
      content: "content",
    });
    const lesson2 = new Lesson({
      content: "content",
    });
    const lesson3 = new Lesson({
      content: "content",
    });
    const teacher = new Teacher({
      name: "John Doe",
      password: "123123",
      username: "johhnydoe.teacher",
    });
    const course = new Course({
      name: "Course 1",
      description: "Test course n1",
      banner: "test_banner.jpg",
      teacher,
      lessons: [lesson1, lesson2, lesson3],
    });

    const student = new Student({
      name: "John Doe",
      password: "123123",
      username: "johhny.doe",
      courses: [course],
    });

    const { lessons, courses } = student.props;

    expect(lessons.length).toStrictEqual(3);
    expect(lessons[0].props.watched).toBeFalsy();

    expect(courses.length).toStrictEqual(1);
    expect(courses[0].props.course).toStrictEqual(course);
    expect(courses[0].props.status).toStrictEqual("not-started");

    student.toggleWatchedLessonStatus(lesson1.id);

    expect(lessons[0].props.watched).toBeTruthy();
    expect(lessons[1].props.watched).toBeFalsy();
    expect(courses[0].props.status).toStrictEqual("in-progress");

    student.toggleWatchedLessonStatus(lesson2.id);
    expect(lessons[1].props.watched).toBeTruthy();
    expect(courses[0].props.status).toStrictEqual("in-progress");

    student.toggleWatchedLessonStatus(lesson3.id);
    expect(lessons[2].props.watched).toBeTruthy();
    expect(courses[0].props.status).toStrictEqual("finished");

    student.toggleWatchedLessonStatus(lesson2.id);
    expect(lessons[1].props.watched).toBeFalsy();
    expect(courses[0].props.status).toStrictEqual("in-progress");

    expect(() => {
      courses[0].approve();
    }).toThrowError(CannotApproveStudentError);

    student.toggleWatchedLessonStatus(lesson2.id);
    expect(lessons[1].props.watched).toBeTruthy();
    expect(courses[0].props.status).toStrictEqual("finished");

    expect(() => {
      courses[0].approve();
    }).not.toThrowError(CannotApproveStudentError);

    expect(courses[0].props.status).toStrictEqual("approved");
  });
});
