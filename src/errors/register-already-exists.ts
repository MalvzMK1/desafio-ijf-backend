export class RegisterAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`${name} register already exists`);
  }
}
