import { AppError } from '../express-bootstrap';

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
