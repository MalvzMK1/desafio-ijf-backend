import { Entity } from "./base-entity";

interface TeacherProps {}

export class Teacher extends Entity<TeacherProps> {
  constructor(props: TeacherProps) {
    super(props);
  }
}
