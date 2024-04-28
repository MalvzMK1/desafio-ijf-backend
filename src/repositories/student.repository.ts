import { Student, StudentEntityProps } from "src/domain/entities/student";
import { Repository } from "./repository";
import { CannotCreateError } from "src/errors/cannot-create";

export class StudentRepository extends Repository<Student, StudentEntityProps> {
  store(obj: Student): void {
    for (const student of this.data) {
      if (student.props.username === obj.props.username)
        throw new CannotCreateError(
          "Username already taken by another student",
        );
    }

    if (!this.data.includes(obj)) this.data.push(obj);
    else throw new CannotCreateError("Student already exists");
  }

  update(id: string, props: StudentEntityProps): Student {
    const foundStudentIdx = this.findItemIndexById(id);

    this.data[foundStudentIdx].edit(props);

    return this.data[foundStudentIdx];
  }
}
