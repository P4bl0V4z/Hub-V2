
import { Button } from '@/components/ui/button';
import BeLoopIcon from '@/components/BeLoopIcons';
import { cn } from '@/lib/utils';

// Datos simulados para la actividad reciente
const recentActivities = [
  {
    id: 1,
    action: 'Ingreso al sistema',
    user: 'Ana Rodríguez',
    company: 'Empresa XYZ',
    time: '5 minutos',
    icon: 'logIn',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    action: 'Actualización de perfil',
    user: 'Carlos Méndez',
    company: 'ABC Corp',
    time: '12 minutos',
    icon: 'user',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    action: 'Documento subido',
    user: 'Laura Gómez',
    company: 'Industrias 123',
    time: '45 minutos',
    icon: 'fileCheck',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    action: 'Creación de reporte',
    user: 'Miguel Torres',
    company: 'Acero SA',
    time: '1 hora',
    icon: 'barChart',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 5,
    action: 'Ticket resuelto',
    user: 'Equipo de Soporte',
    company: 'Soporte BeLoop',
    time: '3 horas',
    icon: 'checkCircle',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  }
];

const AdminRecentActivity = () => {
  return (
    <div className="space-y-6">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex">
          <div className={cn('mt-1 mr-4 flex h-8 w-8 items-center justify-center rounded-full', activity.iconBg)}>
            <BeLoopIcon name={activity.icon} className={activity.iconColor} size={16} />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{activity.action}</p>
              <span className="text-xs text-muted-foreground">Hace {activity.time}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">{activity.user}</span> - {activity.company}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRecentActivity;
