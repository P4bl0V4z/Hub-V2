import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useAccess } from "@/hooks/useAccess";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isSuperAdmin, can } = useAccess();
  const navigate = useNavigate();
  const location = useLocation();

  const links = useMemo(
    () => [
      { to: "/", label: "Inicio", auth: "any" as const },
      { to: "/reports", label: "Reportes", auth: "private" as const },
      { to: "/inventory", label: "Inventario", auth: "private" as const },
      { to: "/modules", label: "Módulos", auth: "private" as const },
      { to: "/academy", label: "Academia", auth: "private" as const },
      { to: "/calendar", label: "Calendario", auth: "private" as const },
      { to: "/messages", label: "Mensajes", auth: "private" as const },
      { to: "/suppliers", label: "Proveedores", auth: "private" as const },
      { to: "/compliance", label: "Cumplimiento", auth: "private" as const },
    ],
    []
  );

  const showAdmin =
    isAuthenticated && (isSuperAdmin || can("roles", "VER"));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-lg font-semibold"
            aria-label="BeLoop"
          >
            BeLoop
          </button>

          {/* Admin quick entry */}
          {showAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="hidden rounded-md border px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground md:inline-block"
              title="Panel de Administración"
            >
              Admin
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-2 md:flex">
          {links
            .filter((l) => (l.auth === "private" ? isAuthenticated : true))
            .map((l) => {
              const active =
                location.pathname === l.to ||
                location.pathname.startsWith(l.to + "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cx(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="hidden rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 md:inline-block"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline-block">
                {user?.nombre ?? user?.email}
              </span>
              <button
                onClick={() => navigate("/settings")}
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Configuración
              </button>
              <button
                onClick={() => {
                  logout?.();
                  navigate("/login");
                }}
                className="rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile bar */}
      <div className="flex items-center gap-2 border-t px-4 py-2 md:hidden">
        <div className="flex flex-wrap gap-2">
          {links
            .filter((l) => (l.auth === "private" ? isAuthenticated : true))
            .slice(0, 4) // no saturar el header móvil
            .map((l) => {
              const active =
                location.pathname === l.to ||
                location.pathname.startsWith(l.to + "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cx(
                    "rounded-md px-2 py-1 text-xs",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "border hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          {showAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="rounded-md border px-2 py-1 text-xs"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
