export interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  errors: ApiError[] | null;
}

export interface ApiError {
  code: string;
  description: string;
}

export interface CheckoutUrl{
    checkoutUrl:string;
}