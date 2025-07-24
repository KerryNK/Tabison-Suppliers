import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "https://suppliers-7zjy.onrender.com/api";
  return {
    get: (path: string) =>
      fetch(`${apiUrl}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then(res => res.json()),
    post: <TBody>(path: string, body: TBody) =>
      fetch(`${apiUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }).then(res => res.json()),
    put: <TBody>(path: string, body: TBody) =>
      fetch(`${apiUrl}${path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }).then(res => res.json()),
    delete: (path: string) =>
      fetch(`${apiUrl}${path}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then(res => res.json()),
  };
} 