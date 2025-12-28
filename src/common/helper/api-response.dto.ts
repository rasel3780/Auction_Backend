export interface ApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  code?: number;
  data?: T;
}

export function ok<T>(data: T, code = 200): ApiResponse<T> {
  return { isSuccess: true, data, code };
}

export function fail<T = null>(message: string, code: number): ApiResponse<T> {
  return { isSuccess: false, message, code };
}
