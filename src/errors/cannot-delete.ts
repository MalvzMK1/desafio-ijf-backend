export class CannotDeleteError extends Error {
  constructor(cause: string) {
    super(`Cannot delete.\nCause: ${cause}`);
  }
}
