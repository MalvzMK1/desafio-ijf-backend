import { Course, CourseProps } from "src/domain/entities/course";
import { Repository } from "./repository";
import { CannotCreateError } from "src/errors/cannot-create";

export class CourseRepository extends Repository<Course, CourseProps> {
  store(course: Course): void {
    for (const item of this.data) {
      if (item.props.name === course.props.name)
        throw new CannotCreateError("Object with same name exists");
    }

    this.data.push(course);
  }

  update(id: string, props: Partial<Omit<CourseProps, "teacher">>): Course {
    const foundItemIdx = this.findItemIndexById(id);

    this.data[foundItemIdx].edit(props);

    return this.data[foundItemIdx];
  }
}
