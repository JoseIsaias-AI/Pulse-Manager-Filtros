export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

export class PayloadValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}
