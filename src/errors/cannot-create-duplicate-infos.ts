export class CannotUpdateError extends Error {
  constructor(cause: string) {
    super(`Cannot update due to ${cause}`);
  }
}
