const API_URL = import.meta.env.VITE_API_BASE_URL || "https://suppliers-7zjy.onrender.com/api";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Send cookies with the request
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || 'Login failed');
  }
  return res.json();
}

export async function register(username: string, email: string, password: string, role: string = "user") {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, email, password, role }), // Use 'name' to match backend
    credentials: 'include', // Send cookies with the request
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || 'Registration failed');
  }
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: 'include',
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || 'Logout failed');
  }
  return res.json();
}
