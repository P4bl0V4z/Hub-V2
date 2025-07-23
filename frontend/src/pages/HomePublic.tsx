import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Beaker, Footprints, PackageCheck, ArrowRight } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const HomePublic = () => {
  const [showLogin, setShowLogin] = useState(false);

  const isAuth = localStorage.getItem("beloop_authenticated") === "true";
  const userName = localStorage.getItem("beloop_user_name") || "";

  return (
    <>
      {/* Banner superior */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white/70 backdrop-blur dark:bg-background/70">
        <div className="text-2xl font-bold text-primary">BeLoop</div>
        <div>
          {isAuth ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">{userName}</span>
              <img src="/user-icon.svg" alt="Usuario" className="w-8 h-8 rounded-full border" />
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowLogin(true)}>Iniciar sesión</Button>
          )}
        </div>
      </header>

      {/* Layout principal */}
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-cyan-100 to-sky-50 dark:from-background dark:via-background dark:to-background">
        <div className="flex flex-1">
          {/* Barra lateral */}
          <aside className="hidden md:flex flex-col w-64 bg-white/60 dark:bg-background/60 shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Acciones</h3>
            <Button variant="ghost" onClick={() => setShowLogin(true)}>Iniciar sesión</Button>
            <Button variant="ghost" asChild>
              <Link to="/registro">Registrarse</Link>
            </Button>
            <Button variant="ghost">Cuestionario REP</Button>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Hero */}
            <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">BeLoop Sustainability Hub</h1>
              <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
                Una plataforma todo‑en‑uno para cumplir con la Ley&nbsp;REP, calcular tu huella y generar pasaportes de producto.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => setShowLogin(true)}>Iniciar sesión</Button>
                <Link to="/registro"><Button size="lg" variant="outline">Registrarse</Button></Link>
              </div>
            </section>

            {/* Módulos */}
            <section className="mx-auto max-w-6xl px-4 py-16 grid gap-8 sm:grid-cols-3">
              <ModuleCard Icon={Beaker} title="Ley REP" desc="Declaraciones, metas y reportes para cumplir con la regulación REP." />
              <ModuleCard Icon={Footprints} title="Huella" desc="Calcula tu huella de carbono y monitorea KPIs ambientales." />
              <ModuleCard Icon={PackageCheck} title="Pasaporte" desc="Trazabilidad y pasaporte digital de producto." />
            </section>

            {/* Cuestionario REP */}
            <section className="px-4 pb-24 text-center">
              <h2 className="text-2xl font-semibold">¿Tu empresa aplica a la Ley&nbsp;REP?</h2>
              <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
                Responde un breve cuestionario gratuito y averígualo.
              </p>
              <Button
                className="mt-6" size="lg" variant="secondary"
                onClick={() => {
                  if (isAuth) {
                    window.location.href = "/cuestionario-rep";
                  } else {
                    setShowLogin(true);
                  }
                }}
              >
                Realizar cuestionario
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </section>
          </main>
        </div>
      </div>

      {/* Modal de login */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Acceder a tu cuenta</DialogTitle>
          </DialogHeader>
          <LoginForm onAdminAccess={() => setShowLogin(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ModuleCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const ModuleCard = ({ Icon, title, desc }: ModuleCardProps) => (
  <Card className="border-none backdrop-blur-sm/60 shadow-md bg-white/60 dark:bg-background/60">
    <CardHeader className="flex items-center justify-center pt-8">
      <Icon className="h-10 w-10 text-primary" />
    </CardHeader>
    <CardContent className="text-center pb-8">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{desc}</CardDescription>
    </CardContent>
  </Card>
);

export default HomePublic;
