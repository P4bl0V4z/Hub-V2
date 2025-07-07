import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({ email, nombre, password });

      toast({
        title: "Registro exitoso",
        description: "Revisa tu correo para activar tu cuenta.",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Error de registro",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Crear cuenta</Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground text-center">
        Revisa tu bandeja de entrada y spam para verificar tu cuenta
      </CardFooter>
    </>
  );
};

export default RegisterForm;
