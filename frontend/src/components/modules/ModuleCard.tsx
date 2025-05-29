
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BeLoopIcon from "@/components/BeLoopIcons";
import { ReactNode } from "react";

interface ModuleActivity {
  date: string;
  description: string;
}

interface ModuleStats {
  active: boolean;
  lastUpdate: string;
  recentActivities: ModuleActivity[];
}

interface ModuleCardProps {
  title: string;
  active: boolean;
  lastUpdate: string;
  statLabel1: string;
  statValue1: string | number;
  statLabel2: string;
  statValue2: string | number;
  recentActivities: ModuleActivity[];
  icon: ReactNode;
  buttonLabel: string;
  onButtonClick: () => void;
}

const ModuleCard = ({
  title,
  active,
  lastUpdate,
  statLabel1,
  statValue1,
  statLabel2,
  statValue2,
  recentActivities,
  icon,
  buttonLabel,
  onButtonClick,
}: ModuleCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={active ? "default" : "secondary"}>
            {active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <CardDescription>
          Actualizado el {lastUpdate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/40 p-3 rounded-lg text-center">
            <div className="font-bold text-2xl">{statValue1}</div>
            <div className="text-xs text-muted-foreground">{statLabel1}</div>
          </div>
          <div className="bg-muted/40 p-3 rounded-lg text-center">
            <div className="font-bold text-2xl">{statValue2}</div>
            <div className="text-xs text-muted-foreground">{statLabel2}</div>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-sm font-medium mb-1">Actividades recientes</div>
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex justify-between text-sm border-t pt-2 pb-2">
              <span className="text-muted-foreground">{activity.date}</span>
              <span className="text-sm">{activity.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onButtonClick}>
          {icon}
          {buttonLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
