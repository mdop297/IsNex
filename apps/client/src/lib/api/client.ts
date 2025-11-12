// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// /**
//  * Make a request to the API.
//  *
//  * @param {string} endpoint - The API endpoint to hit.
//  * @param {RequestInit} [options] - The options to pass to fetch.
//  * @returns {Promise<T>} - The JSON response from the API.
//  */
// export async function apiRequest<T>(
//   endpoint: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`API request failed: ${response.statusText}`);
//   }

//   return response.json() as Promise<T>;
// }

// export const get = <T>(endpoint: string, options?: RequestInit) =>
//   apiRequest<T>(endpoint, { method: 'GET', ...options });

// export const post = <T, B = unknown>(
//   endpoint: string,
//   body: B,
//   options?: RequestInit,
// ) =>
//   apiRequest<T>(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(body),
//     ...options,
//   });

// export const put = <T, B = unknown>(
//   endpoint: string,
//   body: B,
//   options?: RequestInit,
// ) =>
//   apiRequest<T>(endpoint, {
//     method: 'PUT',
//     body: JSON.stringify(body),
//     ...options,
//   });

// export const patch = <T, B = unknown>(
//   endpoint: string,
//   body: B,
//   options?: RequestInit,
// ) =>
//   apiRequest<T>(endpoint, {
//     method: 'PATCH',
//     body: JSON.stringify(body),
//     ...options,
//   });

// export const del = <T>(endpoint: string, options?: RequestInit) =>
//   apiRequest<T>(endpoint, { method: 'DELETE', ...options });
