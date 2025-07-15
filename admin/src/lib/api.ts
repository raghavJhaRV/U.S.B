const API_URL = process.env.NEXT_PUBLIC_API_URL;

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


export async function login( password: string) {
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


