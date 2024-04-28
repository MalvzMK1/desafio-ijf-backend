import { Course } from "src/domain/entities/course";
import { Teacher } from "src/domain/entities/teacher";
import { describe, it, expect } from "vitest";

describe("Course", () => {
  it("should create a course and edit its infos", () => {
    const teacher = new Teacher({});
    const course = new Course({
      name: "Course 1",
      description: "Test course n1",
      banner: "test_banner.jpg",
      teacher,
    });

    expect(course.props.name).toStrictEqual("Course 1");
    expect(course.props.description).toStrictEqual("Test course n1");

    course.edit({
      description: "This course etc...",
    });

    expect(course.props.description).toStrictEqual("This course etc...");
  });
});
