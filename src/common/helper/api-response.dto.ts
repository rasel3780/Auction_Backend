export class ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;

  static ok<T>(data: T, message?: string) {
    return { success: true, data, message };
  }

  static fail<T>(message: string, data?: T) {
    return { success: false, message, data };
  }
}
