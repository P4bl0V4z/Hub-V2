
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const GlobalKPICard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>KPIs Globales</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={16} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Estadísticas clave del desempeño en economía circular</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Estadísticas generales de los módulos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-green-100 text-green-700 rounded-bl-lg text-xs">+5%</div>
            <BeLoopIcon name="fileCheck" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Cumplimiento REP</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-green-100 text-green-700 rounded-bl-lg text-xs">+3%</div>
            <BeLoopIcon name="scale" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">-15%</div>
            <div className="text-sm text-muted-foreground">Huella de carbono</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-green-100 text-green-700 rounded-bl-lg text-xs">+12%</div>
            <BeLoopIcon name="shield" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">36</div>
            <div className="text-sm text-muted-foreground">Pasaportes activos</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-green-100 text-green-700 rounded-bl-lg text-xs">+8%</div>
            <BeLoopIcon name="coinsStacked" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">$28,500</div>
            <div className="text-sm text-muted-foreground">Ahorro estimado</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-blue-100 text-blue-700 rounded-bl-lg text-xs">Nuevo</div>
            <BeLoopIcon name="recycling" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">45%</div>
            <div className="text-sm text-muted-foreground">Índice de Circularidad</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-green-100 text-green-700 rounded-bl-lg text-xs">+15%</div>
            <BeLoopIcon name="truck" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">78%</div>
            <div className="text-sm text-muted-foreground">Proveedores Verificados</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-amber-100 text-amber-700 rounded-bl-lg text-xs">-2%</div>
            <BeLoopIcon name="zap" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">42%</div>
            <div className="text-sm text-muted-foreground">Eficiencia Energética</div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-green-100 text-green-700 rounded-bl-lg text-xs">+20%</div>
            <BeLoopIcon name="barChart" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">65%</div>
            <div className="text-sm text-muted-foreground">Implementación</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalKPICard;
