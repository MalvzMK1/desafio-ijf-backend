import { Entity } from "./base-entity";

interface LessonProps {}

export class Lesson extends Entity<LessonProps> {
  constructor(props: LessonProps) {
    super(props);
  }
}
