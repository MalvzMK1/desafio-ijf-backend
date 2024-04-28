import { Entity } from "./base-entity";

interface StudentProps {}

export class Student extends Entity<StudentProps> {
  constructor(props: StudentProps) {
    super(props);
  }
}
