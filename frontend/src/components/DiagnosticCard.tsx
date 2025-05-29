
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from '@/components/BeLoopIcons';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DiagnosticCard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleStartDiagnostic = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium">Test de Diagnóstico</CardTitle>
          <BeLoopIcon name="flask-conical" className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado del test</p>
                <p className="font-medium">Completado el 15/04/2025</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleStartDiagnostic}>
                <BeLoopIcon name="play" className="h-4 w-4" />
                Iniciar
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">74%</div>
                <div className="text-xs text-muted-foreground">Cumplimiento</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">8/12</div>
                <div className="text-xs text-muted-foreground">Categorías</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">21/35</div>
                <div className="text-xs text-muted-foreground">Requisitos</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test de Diagnóstico</DialogTitle>
            <DialogDescription>
              Este test nos ayudará a entender mejor tu empresa y sus necesidades.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Button 
              className="w-full" 
              onClick={() => {
                setDialogOpen(false);
                navigate("/diagnostic-test");
              }}
            >
              Comenzar Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiagnosticCard;
