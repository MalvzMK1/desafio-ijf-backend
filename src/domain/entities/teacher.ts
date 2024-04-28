import { Entity } from "./base-entity";

export interface TeacherProps {
  name: string;
  username: string;
  password: string;
}

export class Teacher extends Entity<TeacherProps> {
  constructor(props: TeacherProps) {
    super(props);
  }
}
