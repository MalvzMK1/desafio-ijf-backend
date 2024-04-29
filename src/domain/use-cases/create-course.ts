import { Course, CourseProps } from "../entities/course";
import { UseCase } from "./use-case";

export class CreateCourseUseCase extends UseCase {
  execute(courseProps: CourseProps): Course {
    return new Course(courseProps);
  }
}
