export interface ServiceResult<T> {
  succeded: boolean;

  errorMessage?: string;

  data: T;
}