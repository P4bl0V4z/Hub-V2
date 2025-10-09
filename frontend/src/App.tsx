import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ContextualHelpProvider } from "@/components/ContextualHelp";

import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import GlobalMap from "./pages/GlobalMap";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Modules from "./pages/Modules";
import Academy from "./pages/Academy";
import Compliance from "./pages/Compliance";
import Register from "./pages/Register";

import DiagnosticRunner from "./pages/diagnostic/DiagnosticRunner";
import DiagnosticSummary from "./pages/diagnostic/DiagnosticSummary";

import GlobalSearch from "./components/GlobalSearch";
import ChatAssistant from "./components/ChatAssistant";
import VideoTutorialButton from "./components/VideoTutorialButton";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClients from "./pages/admin/AdminClients";
import AdminClientDetail from "./pages/admin/AdminClientDetail";
import AdminCompliance from "./pages/admin/AdminCompliance";
// import AdminUsers from "./pages/admin/AdminUsers"; // ya no se usa
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminActivity from "./pages/admin/AdminActivity";
import Verify from "./pages/Verify";
import HomePublic from "./pages/HomePublic";
import { useAuth } from "./components/auth/AuthContext";
import { bootstrapSession, type SessionUser } from "@/lib/auth";

import RolesPage from "./pages/admin/RolesPage";
import RoleDetailPage from "./pages/admin/RoleDetailPage";
import UsersPage from "./pages/admin/UsersPage";
import PermissionsPage from "./pages/admin/PermissionsPage";

import { useAccess } from "@/hooks/useAccess";

declare global {
  interface Window {
    beLoopLogin?: () => void;
  }
}

/** Mantiene currentPath en sync con React Router */
function PathSync({ onChange }: { onChange: (path: string) => void }) {
  const location = useLocation();
  useEffect(() => {
    onChange(location.pathname);
  }, [location, onChange]);
  return null;
}

/** Componente interno: usa hooks que dependen de Providers (QueryClientProvider, BrowserRouter) */
function InnerApp() {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.tipoUsuario || "user";

  // permisos del usuario actual (solo consultamos si está autenticado)
  const { isSuperAdmin, can } = useAccess({ enabled: isAuthenticated });

  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const _u: SessionUser | null = await bootstrapSession();
      } catch (e) {
        console.error("bootstrapSession failed:", e);
      } finally {
        setReady(true); // evita pantalla en blanco si falla bootstrap
      }
    })();
  }, []);

  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  const getTutorialTitle = useCallback(() => {
    const pathMap: Record<string, string> = {
      "/": "Tutorial: Panel Principal",
      "/inventory": "Tutorial: Gestión de Inventario",
      "/modules": "Tutorial: Módulos BeLoop",
      "/academy": "Tutorial: Academia BeLoop",
      "/calendar": "Tutorial: Calendario de Eventos",
      "/messages": "Tutorial: Sistema de Mensajería",
      "/suppliers": "Tutorial: Gestión de Proveedores",
      "/reports": "Tutorial: Reportes y Análisis",
      "/compliance": "Tutorial: Cumplimiento Normativo",
      "/settings": "Tutorial: Configuración del Perfil",
      "/diagnostic": "Tutorial: Diagnóstico",
      "/diagnostic/summary": "Tutorial: Resumen del Diagnóstico",
    };
    return pathMap[currentPath] || "Tutorial: BeLoop";
  }, [currentPath]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando BeLoop…</p>
        </div>
      </div>
    );
  }

  const isAdminPath = currentPath.startsWith("/admin");

  return (
    <>
      <PathSync onChange={setCurrentPath} />

      {isAuthenticated && !isAdminPath && (
        <>
          <GlobalSearch />
          <VideoTutorialButton
            title={getTutorialTitle()}
            description="Este tutorial te guiará por las principales funcionalidades de esta sección."
          />
          <ChatAssistant />
        </>
      )}

      <Routes>
        {/* Auth */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? (isSuperAdmin || can("roles", "VER")
                  ? <Navigate to="/admin" replace />
                  : <Navigate to="/" replace />)
              : <Login />
          }
        />
        <Route path="/verificar" element={<Verify />} />

        {/* Público / Home */}
        <Route
          path="/"
          element={isAuthenticated ? <Index /> : <HomePublic />}
        />

        {/* Rutas protegidas generales */}
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" replace />} />
        <Route path="/calendar" element={isAuthenticated ? <Calendar /> : <Navigate to="/login" replace />} />
        <Route path="/global-map" element={isAuthenticated ? <GlobalMap /> : <Navigate to="/login" replace />} />
        <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />} />
        <Route path="/suppliers" element={isAuthenticated ? <Suppliers /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" replace />} />
        <Route path="/modules" element={isAuthenticated ? <Modules /> : <Navigate to="/login" replace />} />
        <Route path="/academy" element={isAuthenticated ? <Academy /> : <Navigate to="/login" replace />} />
        <Route path="/compliance" element={isAuthenticated ? <Compliance /> : <Navigate to="/login" replace />} />

        {/* Diagnóstico */}
        <Route path="/diagnostic" element={isAuthenticated ? <DiagnosticRunner /> : <Navigate to="/login" replace />} />
        <Route path="/diagnostic/summary" element={isAuthenticated ? <DiagnosticSummary /> : <Navigate to="/login" replace />} />
        <Route path="/diagnostic/medicion" element={isAuthenticated ? <div className="p-6">Medición (placeholder)</div> : <Navigate to="/login" replace />} />
        <Route path="/diagnostic/vu-retc" element={isAuthenticated ? <div className="p-6">VU – RETC (placeholder)</div> : <Navigate to="/login" replace />} />

        {/* Registro */}
        <Route
          path="/registro"
          element={
            isAuthenticated
              ? (isSuperAdmin || can("roles", "VER")
                  ? <Navigate to="/admin" replace />
                  : <Navigate to="/" replace />)
              : <Register />
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            isAuthenticated && (isSuperAdmin || can("roles", "VER"))
              ? <AdminLayout />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="clients/:id" element={<AdminClientDetail />} />
          <Route path="compliance" element={<AdminCompliance />} />

          {/* ABMs */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/:id" element={<RoleDetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="permissions" element={<PermissionsPage />} />

          {/* resto */}
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="activity" element={<AdminActivity />} />
        </Route>

        {/* Backward-compat */}
        <Route path="/diagnostic-test/*" element={<Navigate to="/diagnostic" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

/** App ahora SOLO se encarga de montar Providers por encima de InnerApp */
const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContextualHelpProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <InnerApp />
          </BrowserRouter>
        </ContextualHelpProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
