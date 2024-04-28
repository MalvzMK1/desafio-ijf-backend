import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { StudentCourse } from "src/domain/entities/studentCourse";
import { Teacher } from "src/domain/entities/teacher";
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

    expect(student.props.lessons.length).toStrictEqual(3);
    expect(student.props.lessons[0].props.watched).toBeFalsy();

    expect(student.props.courses.length).toStrictEqual(1);
    expect(student.props.courses[0].props.course).toStrictEqual(course);
    expect(student.props.courses[0].props.status).toStrictEqual("not-started");

    student.toggleWatchedLessonStatus(lesson1.id);

    expect(student.props.lessons[0].props.watched).toBeTruthy();
    expect(student.props.lessons[1].props.watched).toBeFalsy();
    expect(student.props.courses[0].props.status).toStrictEqual("in-progress");

    student.toggleWatchedLessonStatus(lesson2.id);
    expect(student.props.lessons[1].props.watched).toBeTruthy();
    expect(student.props.courses[0].props.status).toStrictEqual("in-progress");

    student.toggleWatchedLessonStatus(lesson3.id);
    expect(student.props.lessons[2].props.watched).toBeTruthy();
    expect(student.props.courses[0].props.status).toStrictEqual("finished");

    student.toggleWatchedLessonStatus(lesson2.id);
    expect(student.props.lessons[1].props.watched).toBeFalsy();
    expect(student.props.courses[0].props.status).toStrictEqual("in-progress");
  });
});
