import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { Teacher } from "src/domain/entities/teacher";
import { CannotCreateError } from "src/errors/cannot-create";
import { StudentRepository } from "src/repositories/student.repository";
import { beforeEach, describe, it, expect } from "vitest";

describe("Student tests", () => {
  let repository = new StudentRepository();

  beforeEach(() => {
    repository = new StudentRepository();
  });

  it("should not create two students with the same username", () => {
    const student1 = new Student({
      name: "John Doe",
      password: "123123",
      username: "johhny.doe",
    });

    const student2 = new Student({
      name: "Jonas Doe",
      password: "123123",
      username: "johhny.doe",
    });

    repository.store(student1);

    expect(repository.get(student1.id)).toStrictEqual(student1);

    expect(() => {
      repository.store(student2);
    }).toThrowError(CannotCreateError);

    student2.edit({
      username: "jonas.doe",
    });

    expect(() => {
      repository.store(student2);
    }).not.toThrowError(CannotCreateError);

    expect(repository.get(student2.id)).toStrictEqual(student2);
  });

  it("should be possible to see student lessons and if it's watched or not", () => {
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

    student.watchLesson(lesson1.id);

    expect(student.props.lessons[0].props.watched).toBeTruthy();
    expect(student.props.lessons[1].props.watched).toBeFalsy();
  });
});
