import { Entity } from "./base-entity";

export interface StudentProps {
  name: string;
  username: string;
  password: string;
}

export class Student extends Entity<StudentProps> {
  constructor(props: StudentProps) {
    super(props);
  }
}
