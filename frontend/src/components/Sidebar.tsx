
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import BeLoopIcon from "@/components/BeLoopIcons";
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Primero cerramos el diálogo
    setLogoutDialog(false);
    
    // Establecemos el estado de autenticación como falso
    localStorage.setItem("beloop_authenticated", "false");
    localStorage.removeItem("beloop_user_role");
    
    // Mostramos un mensaje de éxito
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    
    // Usamos un timeout para asegurar que se complete la operación de localStorage antes de navegar
    setTimeout(() => {
      // Navegamos directamente a login sin parámetros de consulta
      navigate('/login');
      
      // Forzamos una recarga para asegurarnos que el estado global se actualice completamente
      window.location.reload();
    }, 100);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const menuItems = [
    { icon: "home", label: 'Home', path: '/' },
    { icon: "user", label: 'Perfil', path: '/settings' },
    { icon: "inventory", label: 'Maestro de Productos', path: '/inventory' },
    { icon: "package", label: 'Módulos', path: '/modules' },
    { icon: "book", label: 'Observatorio', path: '/academy' },
    { icon: "calendar", label: 'Calendario', path: '/calendar' },
    { icon: "mail", label: 'Mensajes', path: '/messages' },
    { icon: "users", label: 'Proveedores', path: '/suppliers' },
    { icon: "chart", label: 'Reportes', path: '/reports' },
    { icon: "fileCheck", label: 'Centro de Verificación y Cumplimiento', path: '/compliance' },
  ];

  return (
    <div className={cn(
      "h-screen bg-sidebar flex flex-col relative transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo - Now clickable */}
      <div 
        className={cn(
          "flex items-center h-16 px-4 cursor-pointer",
          collapsed ? "justify-center" : "justify-start"
        )}
        onClick={goToLogin}
      >
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background font-bold">
            B
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background font-bold">
              B
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">BeLoop</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors",
                  window.location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <BeLoopIcon 
                  name={item.icon} 
                  size={20} 
                  className={collapsed ? "mx-auto" : "mr-3"} 
                  strokeWidth={1.5}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-background border border-border rounded-full w-6 h-6 flex items-center justify-center p-0"
      >
        <BeLoopIcon 
          name={collapsed ? "chevronRight" : "chevronLeft"} 
          size={16} 
        />
      </Button>

      {/* User info */}
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "p-4 flex items-center cursor-pointer",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background">
              <span className="text-xs font-medium">AD</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                <p className="text-xs text-sidebar-foreground/70">admin@example.com</p>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-background/90 backdrop-blur-sm border border-border shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 pb-2 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium">Administrador</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/settings')}>
                <BeLoopIcon name="user" size={16} className="mr-2" />
                <span>Mi perfil</span>
              </Button>
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/settings')}>
                <BeLoopIcon name="settings" size={16} className="mr-2" />
                <span>Configuración</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setLogoutDialog(true)}
              >
                <BeLoopIcon name="logOut" size={16} className="mr-2" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
        <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Cerrar sesión</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Estás seguro que deseas cerrar sesión?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setLogoutDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
