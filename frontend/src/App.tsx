
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import DiagnosticTest from "./pages/DiagnosticTest";
import GlobalSearch from "./components/GlobalSearch";
import ChatAssistant from "./components/ChatAssistant";
import VideoTutorialButton from "./components/VideoTutorialButton";

// Admin Panel Pages
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


const App = () => {
  // Create a client instance inside the component
  const [queryClient] = useState(() => new QueryClient());
  // Simple auth state for demo purposes
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("beloop_authenticated") === "true";
  });

  // Get user role
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("beloop_user_role") || "user";
  });

  // Listen for auth changes for demo purposes
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

  // For demo purposes, expose a global function to handle login
  useEffect(() => {
    // @ts-ignore
    window.beLoopLogin = () => {
      localStorage.setItem("beloop_authenticated", "true");
      setIsAuthenticated(true);
      const role = localStorage.getItem("beloop_user_role") || "user";
      setUserRole(role);
    };
  }, []);

  // Get current path for video tutorials
  const [currentPath, setCurrentPath] = useState("");
  
  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    updatePath();
    window.addEventListener('popstate', updatePath);
    
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  // Function to generate tutorial title based on current path
  const getTutorialTitle = () => {
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
    };
    
    return pathMap[currentPath] || "Tutorial: BeLoop";
  };

  // Check if current path is admin path
  const isAdminPath = currentPath.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContextualHelpProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
              <Route path="/login" element={
                isAuthenticated ? 
                  (userRole === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />) 
                  : <Login />
              } />
              <Route path="/verificar" element={<Verify />} />

              {/* Protected Routes */}
              <Route path="/" element={
                isAuthenticated ? <Index /> : <HomePublic />
              } />
              <Route path="/reports" element={
                isAuthenticated ? <Reports /> : <Navigate to="/login" replace />
              } />
              <Route path="/calendar" element={
                isAuthenticated ? <Calendar /> : <Navigate to="/login" replace />
              } />
              <Route path="/global-map" element={
                isAuthenticated ? <GlobalMap /> : <Navigate to="/login" replace />
              } />
              <Route path="/inventory" element={
                isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />
              } />
              <Route path="/suppliers" element={
                isAuthenticated ? <Suppliers /> : <Navigate to="/login" replace />
              } />
              <Route path="/settings" element={
                isAuthenticated ? <Settings /> : <Navigate to="/login" replace />
              } />
              <Route path="/messages" element={
                isAuthenticated ? <Messages /> : <Navigate to="/login" replace />
              } />
              <Route path="/modules" element={
                isAuthenticated ? <Modules /> : <Navigate to="/login" replace />
              } />
              <Route path="/academy" element={
                isAuthenticated ? <Academy /> : <Navigate to="/login" replace />
              } />
              <Route path="/compliance" element={
                isAuthenticated ? <Compliance /> : <Navigate to="/login" replace />
              } />
              <Route path="/diagnostic-test" element={
                isAuthenticated ? <DiagnosticTest /> : <Navigate to="/login" replace />
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                isAuthenticated && userRole === "admin" ? 
                  <AdminLayout /> : <Navigate to="/login" replace />
              }>
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
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ContextualHelpProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
