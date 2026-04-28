export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly data: T;

  constructor(
    data: T,
    success: boolean = true,
  ) {
    this.data = data;
    this.success = success;
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data, 
    };
  }
}