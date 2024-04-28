import { Course } from "src/domain/entities/course";
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
});
