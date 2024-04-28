import { Entity } from "./base-entity";
import { Teacher } from "./teacher";

export interface CourseProps {
  teacher: Teacher;
  name: string;
  description: string;
  banner: string; // TODO: implement blob
}

export class Course extends Entity<CourseProps> {
  constructor(props: CourseProps) {
    super(props);
  }

  edit(data: Partial<Omit<CourseProps, "teacher">>) {
    this.props = { ...this.props, ...data };
  }
}
