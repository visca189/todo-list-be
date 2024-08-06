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

export class DatabaseError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('DATABASE_ERROR', message, 500, false, cause);
  }
}

export class DutyNotFoundError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('DUTY_NOT_FOUND', message, 404, false, cause);
  }
}
