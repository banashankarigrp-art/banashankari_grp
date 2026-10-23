const API_BASE = '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  errors?: any[];
  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Get stored token if any
  const token = localStorage.getItem('bse_access_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Send cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMessage = data.message || 'An error occurred with the request';
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors.map((e: any) => e.message || e).join('. ');
    }
    if (errorMessage.toLowerCase().trim() === 'validation failed') {
      errorMessage = 'Please verify that your full name, email address, and phone number are correctly filled in.';
    }
    throw new ApiError(errorMessage, response.status, data.errors);
  }

  return data;
}

export const api = {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(url: string, body?: any) =>
    request<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
