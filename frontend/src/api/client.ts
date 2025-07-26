/**
 * A custom error class to hold more context from API responses,
 * such as the HTTP status and the error body.
 */
export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, message: string, body: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export function useApi() {
  // The token is no longer needed for headers due to cookie-based auth.
  // The browser will automatically send the 'jwt' cookie with each request.
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "https://suppliers-7zjy.onrender.com/api";

  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      // This is crucial for sending cookies with cross-origin requests.
      credentials: 'include',
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { message: response.statusText || 'An unknown error occurred.' };
      }
      throw new ApiError(response.status, errorBody.message, errorBody);
    }

    // Handle responses that might not have a body (e.g., 204 No Content from a DELETE request)
    if (response.status === 204) {
      return;
    }

    return response.json();
  };

  return {
    get: (path: string) => apiFetch(path),
    post: <TBody>(path: string, body: TBody) =>
      apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    put: <TBody>(path: string, body: TBody) =>
      apiFetch(path, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (path: string) =>
      apiFetch(path, {
        method: "DELETE",
      }),
  };
} 