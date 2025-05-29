
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PlanManagementCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Planes</CardTitle>
        <CardDescription>Administración de planes y licencias activas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between p-4 border rounded-lg">
            <div>
              <h3 className="text-lg font-medium">Plan Estándar</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">10 usuarios</Badge>
                <Badge variant="outline">500 productos</Badge>
                <Badge>Activo</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">$299 <span className="text-sm font-normal text-muted-foreground">/mes</span></div>
              <p className="text-sm text-muted-foreground">Próxima renovación: 15/06/2025</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/40 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Uso de usuarios</div>
              <div className="flex items-center gap-2">
                <Progress value={70} className="h-2" />
                <span className="text-sm text-muted-foreground">7/10</span>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Uso de productos</div>
              <div className="flex items-center gap-2">
                <Progress value={42} className="h-2" />
                <span className="text-sm text-muted-foreground">210/500</span>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Uso de almacenamiento</div>
              <div className="flex items-center gap-2">
                <Progress value={35} className="h-2" />
                <span className="text-sm text-muted-foreground">35%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Ver historial de pagos</Button>
        <Button>Administrar plan</Button>
      </CardFooter>
    </Card>
  );
};

export default PlanManagementCard;
