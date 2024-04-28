export class NotFoundError extends Error {
  constructor() {
    super("No data found");
  }
}
