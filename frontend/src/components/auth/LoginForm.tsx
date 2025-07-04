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
import { login } from "@/lib/auth";

interface LoginFormProps {
  onAdminAccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAdminAccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const data = await login(email, password);
      localStorage.setItem("beloop_token", data.token);
      localStorage.setItem("beloop_authenticated", "true");
      localStorage.setItem("beloop_user_name", data.nombre || "");
      localStorage.setItem("beloop_user_role", data.rol || "user");
      if (window.beLoopLogin) (window as any).beLoopLogin();
      toast({ title: "Bienvenido", description: "Inicio de sesión exitoso" });
      navigate(data.rol === "admin" ? "/admin" : "/");
    } catch (err: any) {
      toast({
        title: "Error de autenticación",
        description: err.message,
        variant: "destructive",
      });
    }
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
            />
          </div>
          <Button type="submit" className="w-full">
            Ingresar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>

      <Separator className="my-2" />

      <CardContent className="pt-4">
        <div className="space-y-4">
          <p className="text-xs text-center text-muted-foreground">o ingresar con</p>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <BeLoopIcon name="gmail" size={16} className="mr-2" />
              Gmail
            </Button>
            <Button variant="outline" className="w-full">
              <BeLoopIcon name="microsoft" size={16} className="mr-2" />
              Microsoft
            </Button>
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
