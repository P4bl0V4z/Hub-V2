
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import ComparatorDialog from "./ComparatorDialog";

const ComparatorCard = () => {
  const [openComparatorDialog, setOpenComparatorDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scale className="mr-2 h-5 w-5" />
          Comparador de Productos
          <ContextHelp 
            id="product-comparator"
            content="Compare el rendimiento ambiental de diferentes productos"
            useHoverCard={true}
            size={16}
            title="Comparador"
          />
        </CardTitle>
        <CardDescription>
          Compare el rendimiento ambiental de diferentes productos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                El comparador permite analizar el desempeño ambiental de múltiples productos, 
                facilitando la toma de decisiones basadas en datos para mejorar 
                la sostenibilidad de su cartera de productos.
              </p>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <h3 className="font-medium mb-2">Características principales</h3>
                <ul className="text-sm space-y-1.5">
                  <li>• Comparativa de huellas de carbono entre productos</li>
                  <li>• Análisis de composición de materiales</li>
                  <li>• Evaluación de atributos de sostenibilidad</li>
                  <li>• Identificación de oportunidades de mejora</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md flex flex-col items-center justify-center p-6 text-center">
            <Scale className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Compare hasta 3 productos para evaluar su rendimiento ambiental
            </p>
            <Button onClick={() => setOpenComparatorDialog(true)}>
              Abrir Comparador
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Dialog */}
      <ComparatorDialog open={openComparatorDialog} onOpenChange={setOpenComparatorDialog} />
    </Card>
  );
};

export default ComparatorCard;
