// frontend/src/lib/auth.ts
const API_URL = (import.meta.env.VITE_API_URL as string)?.replace(/\/+$/, '');

export type SessionUser = {
  id: number;
  email: string;
  nombre?: string;
  tipoUsuario?: string;
  empresas?: Array<{ id: number; nombre: string; roles?: string[] }>;
};

export async function getCurrentUser(expand?: string[]): Promise<SessionUser | null> {
  const qs = expand && expand.length
    ? `?expand=${encodeURIComponent(expand.join(','))}`
    : '';
  const res = await fetch(`${API_URL}/auth/me${qs}`, { credentials: 'include' });
  if (!res.ok) return null;
  return await res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // << cookie httpOnly desde backend
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Error en login";
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      const txt = await res.text().catch(() => "");
      if (txt) message = txt;
    }
    throw new Error(message);
  }

  return await res.json();
}

export async function register(data: { email: string; nombre: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Error en registro";
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      const txt = await res.text().catch(() => "");
      if (txt) message = txt;
    }
    throw new Error(message);
  }

  return await res.json();
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    let message = "Error al verificar";
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      const txt = await res.text().catch(() => "");
      if (txt) message = txt;
    }
    throw new Error(message);
  }
  return await res.json();
}

export async function fetchSession(): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function bootstrapSession(): Promise<SessionUser | null> {
  const user = await fetchSession();
  if (user) {
    localStorage.setItem("beloop_authenticated", "true");
    localStorage.setItem("beloop_user_name", user.email || "");
    //localStorage.setItem("beloop_user_role", user.tipoUsuario || "user");
  } else {
    localStorage.removeItem("beloop_authenticated");
    localStorage.removeItem("beloop_user_name");
    //localStorage.removeItem("beloop_user_role");
  }
  return user;
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  localStorage.removeItem("beloop_authenticated");
  localStorage.removeItem("beloop_user_name");
  //localStorage.removeItem("beloop_user_role");
}
