import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { Teacher } from "src/domain/entities/teacher";
import { CannotCreateError } from "src/errors/cannot-create";
import { CourseRepository } from "src/repositories/course.repository";
import { describe, it, expect, beforeEach } from "vitest";

describe("Course", () => {
  let repository = new CourseRepository();

  beforeEach(() => {
    repository = new CourseRepository();
  });

  it("should create a course and edit its infos", () => {
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
      lessons: [new Lesson({ content: "123" })],
    });

    expect(course.props.name).toStrictEqual("Course 1");
    expect(course.props.description).toStrictEqual("Test course n1");

    course.edit({
      description: "This course etc...",
    });

    expect(course.props.description).toStrictEqual("This course etc...");
  });

  it("should create the course and add and remove students to the course", () => {
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
      lessons: [
        new Lesson({
          content: "content",
        }),
      ],
    });
    const student1 = new Student({
      name: "Jane Doe",
      password: "123123",
      username: "jane.student",
    });
    const student2 = new Student({
      name: "Bob Doe",
      password: "123123",
      username: "bob.student",
    });

    repository.store(course);

    expect(repository.fetch().length).toStrictEqual(1);

    let repoCourse = repository.get(course.id);

    repoCourse.addStudent(student1);
    repoCourse.addStudent(student2);

    repository.update(course.id, repoCourse.props);

    repoCourse = repository.get(course.id);

    expect(repoCourse.props.students.length).toStrictEqual(2);
    expect(repoCourse.props.students[0]).toStrictEqual(student1);
    expect(repoCourse.props.students[1]).toStrictEqual(student2);

    repoCourse.removeStudent(student1.id);

    repository.update(repoCourse.id, repoCourse.props);

    repoCourse = repository.get(course.id);

    expect(repoCourse.props.students.length).toStrictEqual(1);
    expect(repoCourse.props.students[0]).toStrictEqual(student2);
  });

  it("should add and remove lessons to the course", () => {
    const lesson1 = new Lesson({
      content: "content",
    });
    const lesson2 = new Lesson({
      content: "another content",
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
      lessons: [lesson1],
    });

    repository.store(course);

    let repoCourse = repository.get(course.id);

    expect(repoCourse.id).toStrictEqual(course.id);
    expect(repoCourse.props.lessons.length).toStrictEqual(1);

    repoCourse.addLesson(lesson2);

    repository.update(repoCourse.id, repoCourse.props);

    repoCourse = repository.get(course.id);

    expect(repoCourse.props.lessons.length).toStrictEqual(2);
    expect(repoCourse.props.lessons[1].id).toStrictEqual(lesson2.id);

    repoCourse.removeLesson(lesson2.id);

    repository.update(repoCourse.id, repoCourse.props);

    repoCourse = repository.get(course.id);

    expect(repoCourse.props.lessons.length).toStrictEqual(1);
    expect(repoCourse.props.lessons[0]).toStrictEqual(lesson1);
  });

  it("should not be possible to create a course without lessons", () => {
    expect(() => {
      new Course({
        name: "Course 1",
        description: "Test course n1",
        banner: "test_banner.jpg",
        lessons: [],
        teacher: new Teacher({
          name: "Bob Doe",
          password: "123123",
          username: "bob.doe.teacher",
        }),
      });
    }).toThrowError(CannotCreateError);
  });
});
