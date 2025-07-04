import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyEmail } from "@/lib/auth";

const Verify = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => {
          toast({
            title: "Cuenta verificada",
            description: "Ya puedes iniciar sesión.",
          });
          navigate("/login");
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Token inválido o expirado",
            variant: "destructive",
          });
        });
    }
  }, [token, navigate, toast]);

  return <div className="text-center p-10">Verificando tu cuenta...</div>;
};

export default Verify;
