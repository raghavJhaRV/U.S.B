const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { News, Media, Merchandise, } from '../types';

export async function getTeams() {
  const res = await fetch(`${API_URL}/api/teams`, { cache: 'no-store', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch teams');
  return res.json();
}

export async function fetchData(path: string) {
  const token = localStorage.getItem('adminJwt');
  const res = await fetch(`${API_URL}/api/${path}`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}


export async function login(password: string) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }

  return res.json();
}

export async function getEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  return res.json();
}



export async function deleteTeam(id: string) {
  const token = localStorage.getItem('adminJwt');
  const res = await fetch(`${API_URL}/api/teams/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Delete failed: ${errorText}`);
  }

  return res.json();
}


export async function getNews(): Promise<News[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch news: ${res.statusText}`);
  }
  return res.json();
}

// New: Public GET for Media
export async function getMedia(): Promise<Media[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media`, { cache: 'no-store' }); // Media public GET
  if (!res.ok) {
    throw new Error(`Failed to fetch media: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchMerchandiseData(): Promise<Merchandise[]> {
  return fetchAdminData<Merchandise[]>(`api/merchandise`); // Assuming /api/merchandise is the correct path
}


export async function createMerchandise(data: Omit<Merchandise, 'id' | 'created_at'>): Promise<Merchandise> {
  // Ensure the endpoint is correct for POST (e.g., if you have /api/admin/merchandise for admin POST)
  // Based on your latest backend server.ts, /api/merchandise POST is admin-protected via router.
  return fetchAdminData<Merchandise>(`api/merchandise`, 'POST', data);
}

export async function updateMerchandise(id: string, data: Partial<Omit<Merchandise, 'id' | 'created_at'>>): Promise<Merchandise> {
  // Ensure the endpoint is correct for PUT
  return fetchAdminData<Merchandise>(`api/merchandise/${id}`, 'PUT', data);
}

export async function deleteMerchandise(id: string): Promise<void> {
  // Ensure the endpoint is correct for DELETE
  await fetchAdminData<void>(`api/merchandise/${id}`, 'DELETE');
}


// frontend/src/lib/api.ts
// ... (existing imports and functions) ...

export async function uploadMediaFile(file: File): Promise<{ url: string }> {
  const token = localStorage.getItem('adminJwt');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/media-upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Do NOT set 'Content-Type': 'multipart/form-data' here.
      // The browser will set it automatically with the correct boundary when using FormData.
    },
    body: formData,
  });

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch { }
    if (!errorData) {
      errorData = { message: `File upload failed with status ${res.status}: ${res.statusText}` };
    }
    throw new Error(typeof errorData === 'object' && errorData !== null && 'message' in errorData
      ? (errorData as { message: string }).message
      : 'File upload failed');
  }

  return res.json();
}

async function fetchAdminData<T>(
  fullApiPath: string, // e.g., 'api/admin/media'
  method: string = 'GET',
  body?: object
): Promise<T> {
  const token = localStorage.getItem('adminJwt');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const options: RequestInit = { method, headers };
  if (body) { options.body = JSON.stringify(body); }
  const res = await fetch(`${API_URL}/${fullApiPath}`, options);
  if (!res.ok) {
    // FIX 1: Use 'unknown' instead of 'any' for errorData for better type safety.
    // FIX 2: Remove 'e' from catch block if not used, or use '_' for ignored parameters.
    let errorData: unknown; // Changed 'any' to 'unknown'
    try {
      errorData = await res.json();
    } catch { }
    // Safely access properties of errorData (as it's 'unknown')
    const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData && typeof (errorData as { error: string }).error === 'string'
      ? (errorData as { error: string }).error
      : (typeof errorData === 'object' && errorData !== null && 'message' in errorData && typeof (errorData as { message: string }).message === 'string'
        ? (errorData as { message: string }).message
        : `An unknown API error occurred: ${res.statusText}`);
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}


export async function createMedia(data: { title: string; url: string; type: string }): Promise<Media> {
  return fetchAdminData<Media>(`api/admin/media`, 'POST', data);
}

export async function updateMedia(id: string, data: { title?: string; url?: string; type?: string }): Promise<Media> {
  return fetchAdminData<Media>(`api/admin/media/${id}`, 'PUT', data);
}

export async function deleteMedia(id: string): Promise<void> {
  await fetchAdminData<void>(`api/admin/media/${id}`, 'DELETE');
}