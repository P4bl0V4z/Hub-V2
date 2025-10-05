import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, ArrowRight, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HelpTooltip from "@/components/HelpTooltip";
import BeLoopIcon from "@/components/BeLoopIcons";

import { useAuth } from "@/components/auth/AuthContext";
import { api } from "@/lib/api";
import { bootstrapSession } from "@/lib/auth";

interface LoginFormProps {
  onAdminAccess: () => void;
}

const API_URL = (import.meta.env.VITE_API_URL as string)?.replace(/\/+$/, "");

const LoginForm: React.FC<LoginFormProps> = ({ onAdminAccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error de ingreso",
        description: "Por favor ingresa tu correo y contraseña",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const ok = await login(email, password);
      await bootstrapSession(); // refrescar CSRF token
      
      if (!ok) throw new Error("Credenciales inválidas");

      const { data: me } = await api.get("/auth/me", {
        params: { expand: "empresas,roles" },
      });

      const isAdmin =
        Array.isArray(me?.empresas) &&
        me.empresas.some(
          (ue: any) => Array.isArray(ue?.roles) && ue.roles.includes("admin")
        );

      toast({ title: "Bienvenido", description: "Inicio de sesión exitoso" });

      navigate(isAdmin ? "/admin" : "/", { replace: true });
    } catch (err: any) {
      toast({
        title: "Error de autenticación",
        description: err?.message ?? "No se pudo iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!API_URL) {
      console.error("VITE_API_URL no está definido");
      toast({
        title: "Configuración faltante",
        description: "VITE_API_URL no está configurado.",
        variant: "destructive",
      });
      return;
    }

    const url = new URL(window.location.href);

    let from: string;
    if (url.pathname.startsWith("/login")) {
      const redirect = url.searchParams.get("redirect");
      from = redirect && redirect.startsWith("/") ? redirect : "/";
    } else {
      from = url.pathname + url.search + url.hash;
      if (!from || !from.startsWith("/")) from = "/";
    }

    setLoadingGoogle(true);
    window.location.href = `${API_URL}/auth/google?from=${encodeURIComponent(from)}`;
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email">Correo electrónico</Label>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>

      <Separator className="my-2" />

      <CardContent className="pt-4">
        <div className="space-y-4">
          <p className="text-xs text-center text-muted-foreground">o ingresar con</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              aria-label="Ingresar con Google"
              disabled={loadingGoogle}
            >
              <BeLoopIcon name="gmail" size={16} className="mr-2" />
              Google
            </Button>
            {/* Microsoft (deshabilitado por ahora)
            <Button variant="outline" className="w-full" disabled>
              <BeLoopIcon name="microsoft" size={16} className="mr-2" />
              Microsoft
            </Button>
            */}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col space-y-4 pt-0">
        <div className="mt-2 flex items-center justify-center space-x-1">
          <HelpTooltip content="Si no tienes una cuenta, puedes registrarte haciendo clic aquí" />
          <Link to="/registro" className="text-xs text-muted-foreground hover:text-primary">
            ¿No tienes una cuenta? Haz click acá
          </Link>
        </div>
        <div className="flex items-center justify-between w-full text-xs">
          <Link to="/recuperar" className="text-muted-foreground hover:text-primary">
            ¿Olvidó su contraseña?
          </Link>
          <button onClick={onAdminAccess} className="flex items-center text-muted-foreground hover:text-primary">
            <Settings className="mr-1 h-3 w-3" />Acceso administrador
          </button>
        </div>
      </CardFooter>
    </>
  );
};

export default LoginForm;
