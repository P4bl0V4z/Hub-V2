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

// ✅ NUEVAS: runner secuencial + resumen
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
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminActivity from "./pages/admin/AdminActivity";
import Verify from "./pages/Verify";
import HomePublic from "./pages/HomePublic";

declare global {
  interface Window {
    beLoopLogin?: () => void;
  }
}

// Mantiene currentPath en sync con React Router
function PathSync({ onChange }: { onChange: (path: string) => void }) {
  const location = useLocation();
  useEffect(() => {
    onChange(location.pathname);
  }, [location, onChange]);
  return null;
}

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("beloop_authenticated") === "true";
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("beloop_user_role") || "user";
  });

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("beloop_authenticated") === "true";
      const role = localStorage.getItem("beloop_user_role") || "user";
      setIsAuthenticated(auth);
      setUserRole(role);
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    // utilitario para probar login desde consola
    window.beLoopLogin = () => {
      localStorage.setItem("beloop_authenticated", "true");
      setIsAuthenticated(true);
      const role = localStorage.getItem("beloop_user_role") || "user";
      setUserRole(role);
    };
  }, []);

  const [currentPath, setCurrentPath] = useState("");

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

  const isAdminPath = currentPath.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContextualHelpProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                    ? userRole === "admin"
                      ? <Navigate to="/admin" replace />
                      : <Navigate to="/" replace />
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
              <Route
                path="/reports"
                element={isAuthenticated ? <Reports /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/calendar"
                element={isAuthenticated ? <Calendar /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/global-map"
                element={isAuthenticated ? <GlobalMap /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/inventory"
                element={isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/suppliers"
                element={isAuthenticated ? <Suppliers /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/settings"
                element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/messages"
                element={isAuthenticated ? <Messages /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/modules"
                element={isAuthenticated ? <Modules /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/academy"
                element={isAuthenticated ? <Academy /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/compliance"
                element={isAuthenticated ? <Compliance /> : <Navigate to="/login" replace />}
              />

              {/* ✅ Diagnóstico: runner secuencial + summary */}
              <Route
                path="/diagnostic"
                element={isAuthenticated ? <DiagnosticRunner /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/diagnostic/summary"
                element={isAuthenticated ? <DiagnosticSummary /> : <Navigate to="/login" replace />}
              />

              {/* Opcional: placeholders de secciones modulares posteriores */}
              <Route
                path="/diagnostic/medicion"
                element={isAuthenticated ? <div className="p-6">Medición (placeholder)</div> : <Navigate to="/login" replace />}
              />
              <Route
                path="/diagnostic/vu-retc"
                element={isAuthenticated ? <div className="p-6">VU – RETC (placeholder)</div> : <Navigate to="/login" replace />}
              />

              {/* Registro */}
              <Route
                path="/registro"
                element={
                  isAuthenticated
                    ? userRole === "admin"
                      ? <Navigate to="/admin" replace />
                      : <Navigate to="/" replace />
                    : <Register />
                }
              />

              {/* Admin */}
              <Route
                path="/admin"
                element={
                  isAuthenticated && userRole === "admin"
                    ? <AdminLayout />
                    : <Navigate to="/login" replace />
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="clients/:id" element={<AdminClientDetail />} />
                <Route path="compliance" element={<AdminCompliance />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="activity" element={<AdminActivity />} />
              </Route>

              {/* 🔁 Backward-compat: redirige cualquier /diagnostic-test/* */}
              <Route path="/diagnostic-test/*" element={<Navigate to="/diagnostic" replace />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ContextualHelpProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
