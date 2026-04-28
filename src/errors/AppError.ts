export class AppError extends Error {
  public readonly success: boolean = false;
  public readonly statusCode: number;
  public readonly data: unknown[];

  constructor(
    message: string,
    statusCode: number,
    data: unknown[] = []
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;

    // Fix prototype chain (quan trọng khi extend Error trong TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default AppError;