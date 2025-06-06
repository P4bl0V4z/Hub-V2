
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

interface LoginFormProps {
  onAdminAccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAdminAccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for demo
    if (!email || !password) {
      toast({
        title: "Error de ingreso",
        description: "Por favor ingresa tu correo y contraseña",
        variant: "destructive"
      });
      return;
    }

    // Check if this is an admin login (for demo purposes)
    if (email.includes("admin") || isAdmin) {
      // Set admin role
      localStorage.setItem("beloop_user_role", "admin");
      localStorage.setItem("beloop_authenticated", "true");
      
      // Use the global function to update auth state in App component
      // @ts-ignore
      if (window.beLoopLogin) window.beLoopLogin();
      
      toast({
        title: "Bienvenido al Panel de Administrador",
        description: "Has ingresado como administrador.",
      });
      
      // Redirect to admin dashboard
      navigate("/admin");
    } else {
      // Regular user login
      localStorage.setItem("beloop_user_role", "user");
      localStorage.setItem("beloop_authenticated", "true");
      
      // Use the global function to update auth state in App component
      // @ts-ignore
      if (window.beLoopLogin) window.beLoopLogin();
      
      toast({
        title: "Bienvenido a BeLoop",
        description: "Has ingresado correctamente.",
      });
      
      // Redirect to dashboard
      navigate("/");
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adminLogin"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="adminLogin" className="text-sm">Iniciar sesión como administrador</Label>
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
<<<<<<< Updated upstream
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleLogin({ preventDefault: () => {} } as React.FormEvent)}
            >
              <BeLoopIcon name="gmail" size={16} className="mr-2" />
              Gmail
            </Button>
=======
            <a href="http://localhost:3001/auth/google" className="w-full">
              <Button variant="outline" className="w-full">
                <BeLoopIcon name="gmail" size={16} className="mr-2" />
                  Gmail prueba
              </Button>
            </a>
>>>>>>> Stashed changes
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleLogin({ preventDefault: () => {} } as React.FormEvent)}
            >
              <BeLoopIcon name="windows" size={16} className="mr-2" />
              Windows
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
          <button 
            onClick={onAdminAccess} 
            className="flex items-center text-muted-foreground hover:text-primary"
          >
            <Settings className="mr-1 h-3 w-3" />
            Acceso administrador
          </button>
        </div>
      </CardFooter>
    </>
  );
};

export default LoginForm;
