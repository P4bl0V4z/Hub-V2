
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isLogout = params.get('logout') === 'true';
    const isAuthenticated = localStorage.getItem("beloop_authenticated") === "true";
    if (isAuthenticated && !isLogout) {
      const userRole = localStorage.getItem("beloop_user_role") || "user";
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate, location]);

  const handleAdminAccess = () => {
    localStorage.setItem("beloop_user_role", "admin");
    localStorage.setItem("beloop_authenticated", "true");
    
    if (window.beLoopLogin) window.beLoopLogin();
    
    toast({
      title: "Acceso de administrador",
      description: "Ingresando al panel de administración.",
    });
    
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <LoginHeader />
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Acceso</CardTitle>
            <CardDescription>Ingresa a tu cuenta para continuar</CardDescription>
          </CardHeader>
          <LoginForm onAdminAccess={handleAdminAccess} />
        </Card>
      </div>
    </div>
  );
};

export default Login;
