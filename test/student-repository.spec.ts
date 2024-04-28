import { Student } from "src/domain/entities/student";
import { CannotCreateError } from "src/errors/cannot-create";
import { NotFoundError } from "src/errors/not-found-error";
import { StudentRepository } from "src/repositories/student.repository";
import { beforeEach, describe, expect, it } from "vitest";

describe("Student repository tests", () => {
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

  it("should create, update and delete a student", () => {
    const student1 = new Student({
      name: "John Doe",
      password: "123123",
      username: "johhny.doe",
    });

    const student2 = new Student({
      name: "Jonas Doe",
      password: "123123",
      username: "jonas.doe",
    });

    repository.store(student1);
    repository.store(student2);

    let repoStudent2 = repository.get(student2.id);

    expect(repoStudent2).toStrictEqual(student2);

    repoStudent2.edit({
      password: "321321",
    });

    repository.update(student2.id, repoStudent2.props);

    repoStudent2 = repository.get(student2.id);

    expect(repoStudent2.props.password).toStrictEqual("321321");

    expect(repository.fetch().length).toStrictEqual(2);

    repository.delete(student1.id);

    expect(repository.fetch().length).toStrictEqual(1);
    expect(repository.fetch().includes(student1)).toBeFalsy();
  });

  it("should not find a user", () => {
    const student1 = new Student({
      name: "John Doe",
      password: "123123",
      username: "johhny.doe",
    });

    repository.store(student1);

    expect(() => {
      repository.get("test_id");
    }).toThrowError(NotFoundError);
  });
});
