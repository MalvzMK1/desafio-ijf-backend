import { randomUUID } from "crypto";

export abstract class Entity<T> {
  #id = randomUUID();
  #created_at = new Date();
  #props: T;

  constructor(props: T) {
    this.#props = props;
  }

  get id(): string {
    return this.#id;
  }

  get created_at(): Date {
    return this.#created_at;
  }

  get props(): T {
    return this.#props;
  }

  set props(props: T) {
    this.#props = props;
  }
}
