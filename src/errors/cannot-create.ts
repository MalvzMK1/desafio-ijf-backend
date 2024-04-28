export class CannotCreateError extends Error {
  constructor(cause: string) {
    super(`Cannot create.\nCause: ${cause}`);
  }
}
