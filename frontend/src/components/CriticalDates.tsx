
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from "@/components/BeLoopIcons";

interface CriticalDate {
  id: string;
  title: string;
  date: string;
  status: "upcoming" | "today" | "overdue";
  type: "deadline" | "report" | "compliance" | "renewal";
}

const criticalDates: CriticalDate[] = [
  {
    id: "1",
    title: "Declaración Jurada REP",
    date: "2025-05-15",
    status: "upcoming",
    type: "compliance"
  },
  {
    id: "2",
    title: "Informe de Sostenibilidad",
    date: "2025-05-10",
    status: "upcoming",
    type: "report"
  },
  {
    id: "3",
    title: "Plan de Gestión Anual",
    date: "2025-05-04",
    status: "today",
    type: "deadline"
  },
  {
    id: "4",
    title: "Certificación ISO 14001",
    date: "2025-04-28",
    status: "overdue",
    type: "renewal"
  },
  {
    id: "5",
    title: "Auditoría Interna",
    date: "2025-04-15",
    status: "overdue",
    type: "compliance"
  }
];

const getStatusColor = (status: CriticalDate["status"]) => {
  switch (status) {
    case "upcoming": return "bg-blue-100 text-blue-800";
    case "today": return "bg-amber-100 text-amber-800";
    case "overdue": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: CriticalDate["type"]) => {
  switch (type) {
    case "deadline": return { name: "calendarClock", className: "text-sidebar-foreground" };
    case "report": return { name: "fileText", className: "text-sidebar-foreground" };
    case "compliance": return { name: "shieldCheck", className: "text-sidebar-foreground" };
    case "renewal": return { name: "refresh", className: "text-sidebar-foreground" };
    default: return { name: "info", className: "text-sidebar-foreground" };
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es', { 
    day: 'numeric', 
    month: 'short'
  }).format(date);
};

const CriticalDates = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BeLoopIcon name="calendar" size={18} className="text-sidebar-foreground" />
          Fechas Críticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criticalDates.map((item) => {
            const typeIcon = getTypeIcon(item.type);
            
            return (
              <div key={item.id} className="flex items-center">
                <div className="mr-3 text-lg">
                  <BeLoopIcon name={typeIcon.name} size={20} className={typeIcon.className} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === "upcoming" ? "Próximo" : 
                       item.status === "today" ? "Hoy" : "Vencido"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalDates;
