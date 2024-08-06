export class AppError extends Error {
  constructor(
    public name: string,
    public message: string,
    public HTTPStatus: number = 500,
    public isCatastrophic = false,
    public cause?: unknown
  ) {
    super(message);
  }
}

export class BadInputError extends AppError {
  constructor(public message: string, public cause?: unknown) {
    super('BAD_INPUT_ERROR', message, 400, false, cause);
  }
}

export class ValidationError extends AppError {
  constructor(public message: string, public cause?: unknown) {
    super('VALIDATION_ERROR', message, 400, false, cause);
  }
}
