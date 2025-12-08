export interface ApiResponse<T> {
  isError: boolean;
  message?: string;
  code?: number;
  data?: T;
}

export function ok<T>(data: T, code = 200): ApiResponse<T> {
  return { isError: false, data, code };
}

export function fail<T = null>(message: string, code: number): ApiResponse<T> {
  return { isError: true, message, code };
}
