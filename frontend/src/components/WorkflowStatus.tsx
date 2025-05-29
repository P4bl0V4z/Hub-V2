
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import BeLoopIcon from "@/components/BeLoopIcons";

interface Workflow {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending" | "paused";
  progress: number;
  dueDate?: string;
  assignee?: string;
}

const workflows: Workflow[] = [
  {
    id: "1",
    name: "Declaración Anual REP",
    status: "in-progress",
    progress: 65,
    dueDate: "2025-05-15",
    assignee: "María Rodríguez"
  },
  {
    id: "2",
    name: "Actualización de Inventario",
    status: "completed",
    progress: 100,
    dueDate: "2025-04-30",
    assignee: "Carlos Gómez"
  },
  {
    id: "3",
    name: "Evaluación de Proveedores",
    status: "pending",
    progress: 0,
    dueDate: "2025-05-20",
    assignee: "Ana Martínez"
  },
  {
    id: "4",
    name: "Auditoría de Empaque",
    status: "paused",
    progress: 32,
    dueDate: "2025-06-10",
    assignee: "Jorge Sánchez"
  }
];

const getStatusColor = (status: Workflow["status"]) => {
  switch (status) {
    case "completed": return "text-green-500";
    case "in-progress": return "text-blue-500";
    case "pending": return "text-amber-500";
    case "paused": return "text-gray-500";
    default: return "text-gray-800";
  }
};

const getStatusIcon = (status: Workflow["status"]) => {
  switch (status) {
    case "completed": return "checkCircle";
    case "in-progress": return "activity";
    case "pending": return "clock";
    case "paused": return "pause";
    default: return "info";
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return "bg-green-500";
  if (progress > 65) return "bg-blue-500";
  if (progress > 30) return "bg-amber-500";
  return "bg-gray-400";
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es', { 
    day: 'numeric', 
    month: 'short' 
  }).format(date);
};

const WorkflowStatus = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BeLoopIcon name="activity" size={18} className="text-sidebar-foreground" />
          Estado de Workflows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BeLoopIcon 
                    name={workflow.name.includes("REP") ? "fileCheck" : 
                          workflow.name.includes("Inventario") ? "clipboardList" :
                          workflow.name.includes("Proveedores") ? "users" : 
                          "shieldCheck"} 
                    size={16} 
                    className="text-sidebar-foreground" 
                  />
                  <p className="text-sm font-medium">{workflow.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <BeLoopIcon 
                    name={getStatusIcon(workflow.status)} 
                    size={14} 
                    className={getStatusColor(workflow.status)} 
                  />
                  <span className={`text-xs font-medium ${getStatusColor(workflow.status)}`}>
                    {workflow.status === "completed" ? "Completado" : 
                     workflow.status === "in-progress" ? "En progreso" : 
                     workflow.status === "pending" ? "Pendiente" : "Pausado"}
                  </span>
                </div>
              </div>
              <Progress 
                value={workflow.progress} 
                className="h-2"
                indicatorClassName={getProgressColor(workflow.progress)}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {workflow.assignee && (
                  <div className="flex items-center gap-1">
                    <BeLoopIcon name="user" size={12} className="text-muted-foreground" />
                    <span>{workflow.assignee}</span>
                  </div>
                )}
                {workflow.dueDate && (
                  <div className="flex items-center gap-1">
                    <BeLoopIcon name="calendar" size={12} className="text-muted-foreground" />
                    <span>Vence: {formatDate(workflow.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowStatus;
