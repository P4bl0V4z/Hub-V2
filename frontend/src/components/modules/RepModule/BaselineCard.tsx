
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import HistoricalTrendChart from "./HistoricalTrendChart";
import BaselineCalculationDialog from "./BaselineCalculationDialog";

const BaselineCard = () => {
  const [openBaselineDialog, setOpenBaselineDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCheck className="mr-2 h-5 w-5" />
          Línea Base REP
          <ContextHelp 
            id="rep-baseline"
            content="Establecimiento de líneas base para materialidad y reportabilidad"
            useHoverCard={true}
            size={16}
            title="Línea Base"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">Tendencia histórica de reportes</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Visualización de avance anual respecto a las metas de cumplimiento
            </p>
            <HistoricalTrendChart />
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Cálculo de Línea Base</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Establecimiento de líneas base para materialidad conforme a requisitos REP
            </p>
            <div className="flex justify-between">
              <span className="text-sm">Actualizado: 01/05/2025</span>
              <Button size="sm" variant="outline" onClick={() => setOpenBaselineDialog(true)}>
                Administrar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Dialog */}
      <BaselineCalculationDialog 
        open={openBaselineDialog} 
        onOpenChange={setOpenBaselineDialog} 
      />
    </Card>
  );
};

export default BaselineCard;
