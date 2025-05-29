
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from '@/components/BeLoopIcons';
import { Progress } from "@/components/ui/progress";

interface WelcomeCardProps {
  userName: string;
  implementationPercentage: number;
}

const WelcomeCard = ({ userName, implementationPercentage }: WelcomeCardProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Bienvenido, {userName}</CardTitle>
        <BeLoopIcon name="user" className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Implementación del software</span>
            <span className="text-sm font-medium">{implementationPercentage}%</span>
          </div>
          <Progress value={implementationPercentage} className="h-2" />
          <div className="text-sm text-muted-foreground pt-1">
            Tu avance en BeLoop está {implementationPercentage < 50 ? 'en progreso' : implementationPercentage < 80 ? 'avanzado' : 'casi completo'}.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
