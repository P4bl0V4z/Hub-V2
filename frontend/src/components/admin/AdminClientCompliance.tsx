
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Button } from "@/components/ui/button";

// Datos simulados de cumplimiento
const complianceData = [
  {
    id: 1,
    category: 'Documentación Legal',
    requiredItems: 8,
    completedItems: 8,
    lastUpdate: '2023-04-28',
    status: 'complete',
    details: [
      { name: 'Registro de empresa', completed: true },
      { name: 'Permisos ambientales', completed: true },
      { name: 'Certificados de operación', completed: true }
    ]
  },
  {
    id: 2,
    category: 'Reportes Ambientales',
    requiredItems: 12,
    completedItems: 10,
    lastUpdate: '2023-05-02',
    status: 'in-progress',
    details: [
      { name: 'Informe de emisiones', completed: true },
      { name: 'Registro de residuos', completed: true },
      { name: 'Plan de mitigación', completed: false }
    ]
  },
  {
    id: 3,
    category: 'Certificaciones',
    requiredItems: 5,
    completedItems: 4,
    lastUpdate: '2023-04-15',
    status: 'in-progress',
    details: [
      { name: 'ISO 14001', completed: true },
      { name: 'Certificación REP', completed: true },
      { name: 'Huella de carbono', completed: false }
    ]
  },
  {
    id: 4,
    category: 'Materiales y Componentes',
    requiredItems: 15,
    completedItems: 12,
    lastUpdate: '2023-05-01',
    status: 'in-progress',
    details: [
      { name: 'Registro de materiales', completed: true },
      { name: 'Fichas técnicas', completed: true },
      { name: 'Declaración de sustancias', completed: false }
    ]
  },
  {
    id: 5,
    category: 'Auditorías',
    requiredItems: 3,
    completedItems: 3,
    lastUpdate: '2023-03-20',
    status: 'complete',
    details: [
      { name: 'Auditoría interna', completed: true },
      { name: 'Auditoría externa', completed: true },
      { name: 'Plan de mejora', completed: true }
    ]
  }
];

interface AdminClientComplianceProps {
  clientId: number;
}

const AdminClientCompliance = ({ clientId }: AdminClientComplianceProps) => {
  // Calcular estadísticas de cumplimiento
  const totalRequired = complianceData.reduce((sum, item) => sum + item.requiredItems, 0);
  const totalCompleted = complianceData.reduce((sum, item) => sum + item.completedItems, 0);
  const complianceRate = Math.round((totalCompleted / totalRequired) * 100);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold">Resumen de Cumplimiento</h3>
              <p className="text-muted-foreground">Evaluación global del estado de cumplimiento</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{complianceRate}%</div>
                <div className="text-sm text-muted-foreground">Cumplimiento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalCompleted}/{totalRequired}</div>
                <div className="text-sm text-muted-foreground">Elementos</div>
              </div>
            </div>
          </div>

          <Progress value={complianceRate} className="h-2 mb-8" />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead className="hidden md:table-cell">Última actualización</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={(item.completedItems / item.requiredItems) * 100} 
                          className="h-2 w-24 md:w-40" 
                        />
                        <span>
                          {item.completedItems}/{item.requiredItems}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(item.lastUpdate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'complete' ? "default" : "secondary"}>
                        {item.status === 'complete' ? 'Completado' : 'En progreso'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <BeLoopIcon name="eye" size={16} className="mr-2" />
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClientCompliance;
