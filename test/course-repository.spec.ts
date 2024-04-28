import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { Teacher } from "src/domain/entities/teacher";
import { CannotCreateError } from "src/errors/cannot-create";
import { CourseRepository } from "src/repositories/course.repository";
import { describe, it, expect, beforeEach } from "vitest";

describe("Course repository", () => {
  let repository = new CourseRepository();

  beforeEach(() => {
    repository = new CourseRepository();
  });

  it("should store a new course into the repository", () => {
    let courses = repository.fetch();

    expect(courses.length).toStrictEqual(0);

    const teacher = new Teacher({
      name: "John Doe",
      password: "123123",
      username: "johhnydoe.teacher",
    });
    const course = new Course({
      banner: "banner.png",
      description: "course description",
      name: "course1",
      teacher,
      lessons: [
        new Lesson({
          content: "content",
        }),
      ],
    });

    repository.store(course);

    courses = repository.fetch();

    expect(courses.length).toStrictEqual(1);
    expect(courses[0]).toEqual(course);

    expect(() => {
      repository.store(course);
    }).toThrow(CannotCreateError);
  });

  it("should update the course", () => {
    const teacher = new Teacher({
      name: "John Doe",
      password: "123123",
      username: "johhnydoe.teacher",
    });
    const course = new Course({
      banner: "banner.png",
      description: "course description",
      name: "course1",
      teacher,
      lessons: [
        new Lesson({
          content: "content",
        }),
      ],
    });

    repository.store(course);

    let courseFromRepo = repository.get(course.id);

    expect(courseFromRepo).toStrictEqual(course);
    expect(courseFromRepo.props.description).toStrictEqual(
      "course description",
    );

    repository.update(course.id, {
      description: "Just another description",
    });

    courseFromRepo = repository.get(course.id);

    expect(courseFromRepo.props.description).toStrictEqual(
      "Just another description",
    );
  });

  it("should get all students of the course", () => {
    const teacher = new Teacher({
      name: "John Doe",
      password: "123123",
      username: "johhnydoe.teacher",
    });
    const course = new Course({
      banner: "banner.png",
      description: "course description",
      name: "course1",
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

    const course2 = new Course({
      banner: "banner.png",
      description: "course description",
      name: "course2",
      teacher,
      lessons: [
        new Lesson({
          content: "content",
        }),
      ],
    });
    const student3 = new Student({
      name: "Jane Doe",
      password: "123123",
      username: "jane.student",
    });
    const student4 = new Student({
      name: "Bob Doe",
      password: "123123",
      username: "bob.student",
    });

    course.addStudent(student1);
    course.addStudent(student2);

    course2.addStudent(student3);
    course2.addStudent(student4);

    repository.store(course);
    repository.store(course2);

    expect(repository.get(course.id)).toStrictEqual(course);
    expect(repository.get(course2.id)).toStrictEqual(course2);

    const {
      props: { students: course1students },
    } = repository.get(course.id);
    const {
      props: { students: course2students },
    } = repository.get(course2.id);

    expect(course1students.length).toStrictEqual(2);
    expect(course1students[0]).toStrictEqual(student1);
    expect(course1students[1]).toStrictEqual(student2);
    expect(course2students.length).toStrictEqual(2);
    expect(course2students[0]).toStrictEqual(student3);
    expect(course2students[1]).toStrictEqual(student4);
  });
});
