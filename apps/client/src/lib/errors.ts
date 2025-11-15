export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Record<string, string[]>, // validation errors
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
