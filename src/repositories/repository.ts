import { Entity } from "src/domain/entities/base-entity";
import { NotFoundError } from "src/errors/not-found-error";

export abstract class Repository<T extends Entity<K>, K> {
  protected data: Array<T>;

  constructor() {
    this.data = [];
  }

  abstract store(obj: T): void;

  abstract update(id: T["id"], props: T["props"]): T;

  fetch(): Array<T> {
    return this.data;
  }

  get(id: T["id"]): T {
    const foundData = this.data.find((item) => item.id === id);

    if (foundData) return foundData;
    throw new NotFoundError();
  }

  delete(id: T["id"]): void {
    const foundIdx = this.data.findIndex((item) => item.id === id);

    if (foundIdx < 0) throw new NotFoundError();

    this.data.splice(foundIdx, 1);
  }

  protected findItemIndexById(id: T["id"]) {
    const foundItemIdx = this.data.findIndex((item) => item.id === id);
    if (foundItemIdx < 0) throw new NotFoundError();
    return foundItemIdx;
  }
}
