export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message?: string;
  public readonly data: T;

  constructor(data: T, message?: string, success: boolean = true) {
    this.data = data;
    this.message = message;
    this.success = success;
  }

  toJSON() {
    return {
      success: this.success,
      ...(this.message && { message: this.message }),
      data: this.data,
    };
  }
}
