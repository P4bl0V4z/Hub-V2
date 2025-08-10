export async function login(email: string, password: string) {
  console.log(import.meta.env.VITE_API_URL) ;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error en login");
  }

  return await res.json(); 
}

export async function register(data: { email: string; nombre: string; password: string }) {
  console.log(import.meta.env.VITE_API_URL) ;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error en registro");
  }

  return await res.json();
}

export async function verifyEmail(token: string) {
  console.log(import.meta.env.VITE_API_URL) ;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?token=${token}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al verificar");
  }
  return await res.json();
}
