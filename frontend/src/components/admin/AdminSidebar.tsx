import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import HelpTooltip from "@/components/HelpTooltip";
import { useAccess } from '@/hooks/useAccess';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const { isSuperAdmin, can } = useAccess({ enabled: true });

  // 👇 claves de objetos en BD: 'roles', 'usuarios', 'objetos'
  const canRoles   = isSuperAdmin || can('roles', 'VER');
  const canUsers   = isSuperAdmin || can('usuarios', 'VER');
  const canObjects = isSuperAdmin || can('objetos', 'VER');

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    setLogoutDialog(false);
    localStorage.setItem("beloop_authenticated", "false");
    localStorage.removeItem("beloop_user_role");
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente." });
    setTimeout(() => { navigate('/login'); window.location.reload(); }, 100);
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const menuItems = [
    { icon: "layoutDashboard", label: 'Dashboard', path: '/admin', show: true },
   // { icon: "users", label: 'Clientes', path: '/admin/clients', show: true },
   // { icon: "fileCheck", label: 'Cumplimiento', path: '/admin/compliance', show: true },

    // 🔐 ABMs visibles según permisos o superadmin
    { icon: "user",   label: 'Usuarios', path: '/admin/users', show: canUsers },
    { icon: "shield", label: 'Roles', path: '/admin/roles', show: canRoles },
    { icon: "package",   label: 'Objetos', path: '/admin/permissions', show: canObjects },
    

    { icon: "settings", label: 'Configuración', path: '/admin/settings', show: true },
    { icon: "barChart", label: 'Reportes', path: '/admin/reports', show: true },
    { icon: "ticket", label: 'Soporte', path: '/admin/support', show: true },
    { icon: "activity", label: 'Actividad', path: '/admin/activity', show: true },
  ];

  return (
    <div className={cn(
      "h-screen bg-sidebar flex flex-col relative transition-all duration-300 border-r border-sidebar-border",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed ? "justify-center" : "justify-start"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background font-bold">
            AB
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background font-bold">
              AB
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-sidebar-foreground">Admin</span>
              <span className="text-xs text-sidebar-foreground/70">BeLoop</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {menuItems.filter(i => i.show).map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors",
                  isActive(item.path) 
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
        <BeLoopIcon name={collapsed ? "chevronRight" : "chevronLeft"} size={16} />
      </Button>

      {/* User info */}
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "p-4 flex items-center cursor-pointer border-t border-sidebar-border",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background">
              <span className="text-xs font-medium">SA</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">Super Admin</p>
                <p className="text-xs text-sidebar-foreground/70">admin@beloop.com</p>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-background/90 backdrop-blur-sm border border-border shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 pb-2 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar-background">
                <span className="text-sm font-medium">SA</span>
              </div>
              <div>
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">admin@beloop.com</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/admin/settings')}>
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

export default AdminSidebar;
