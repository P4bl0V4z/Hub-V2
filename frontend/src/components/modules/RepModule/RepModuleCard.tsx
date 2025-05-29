
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import ProviderManagementDialog from "./ProviderManagementDialog";
import MaterialTraceabilityDialog from "./MaterialTraceabilityDialog";
import GransicIntegrationDialog from "./GransicIntegrationDialog";

const RepModelCard = () => {
  const [openProviderDialog, setOpenProviderDialog] = useState(false);
  const [openMaterialsDialog, setOpenMaterialsDialog] = useState(false);
  const [openGransicDialog, setOpenGransicDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCheck className="mr-2 h-5 w-5" />
          Modelo de Trazabilidad REP
          <ContextHelp 
            id="rep-model"
            content="Sistema de trazabilidad para la gestión de responsabilidad extendida del productor"
            useHoverCard={true}
            size={16}
            title="Modelo REP"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Gestión de Proveedores</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Sistema de registro y evaluación de proveedores según criterios REP
            </p>
            <div className="flex justify-between">
              <span className="text-sm">Completado: 85%</span>
              <Button size="sm" variant="outline" onClick={() => setOpenProviderDialog(true)}>
                Administrar
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Trazabilidad de Materiales</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Seguimiento del origen y destino de materiales prioritarios
            </p>
            <div className="flex justify-between">
              <span className="text-sm">Completado: 72%</span>
              <Button size="sm" variant="outline" onClick={() => setOpenMaterialsDialog(true)}>
                Administrar
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Integración con GRANSIC</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Conectividad con sistemas colectivos de gestión
            </p>
            <div className="flex justify-between">
              <span className="text-sm">Completado: 90%</span>
              <Button size="sm" variant="outline" onClick={() => setOpenGransicDialog(true)}>
                Administrar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Dialogs */}
      <ProviderManagementDialog 
        open={openProviderDialog} 
        onOpenChange={setOpenProviderDialog} 
      />
      
      <MaterialTraceabilityDialog 
        open={openMaterialsDialog} 
        onOpenChange={setOpenMaterialsDialog} 
      />
      
      <GransicIntegrationDialog 
        open={openGransicDialog} 
        onOpenChange={setOpenGransicDialog}
      />
    </Card>
  );
};

export default RepModelCard;
