export class CannotApproveStudentError extends Error {
  constructor() {
    super("Cannot approve student, it needs to finish the course first");
  }
}
