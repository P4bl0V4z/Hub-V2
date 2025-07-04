import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => (
  <div className="flex min-h-screen items-center justify-center p-4 bg-background">
    <div className="w-full max-w-md space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>Regístrate para comenzar</CardDescription>
        </CardHeader>
        <RegisterForm />
      </Card>
    </div>
  </div>
);

export default Register;
