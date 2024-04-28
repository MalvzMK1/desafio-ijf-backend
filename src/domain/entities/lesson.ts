import { Entity } from "./base-entity";

type LessonContent = string | Blob;

interface LessonProps {
  content: LessonContent;
}

export class Lesson extends Entity<LessonProps> {
  constructor(props: LessonProps) {
    super(props);
  }
}
