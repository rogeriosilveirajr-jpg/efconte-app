export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed with ${response.status}: ${errorBody}`);
  }
  return response.json();
}
