
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeLoopIcon from "@/components/BeLoopIcons";

const AdminCompliance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Centro de Cumplimiento</h2>
          <p className="text-muted-foreground">
            Supervisión de cumplimiento normativo y regulaciones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Buscar cliente o regulación..." 
            className="w-full md:w-80" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <BeLoopIcon name="download" className="mr-2" size={16} />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estado global de cumplimiento */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cumplimiento Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes en Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">12</div>
            <div className="flex items-center text-sm text-amber-500 mt-1">
              <BeLoopIcon name="alertTriangle" size={16} className="mr-1" />
              <span>Requieren revisión inmediata</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documentos Próximos a Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">28</div>
            <div className="flex items-center text-sm text-blue-500 mt-1">
              <BeLoopIcon name="calendar" size={16} className="mr-1" />
              <span>En los próximos 30 días</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de categorías */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Estado de Cumplimiento por Cliente</CardTitle>
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="risk">En Riesgo</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="compliant">Cumplidos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Monitoreo de cumplimiento normativo por cliente y categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Cumplimiento</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Ejemplo de datos - En producción debe ser dinámico */}
                <TableRow>
                  <TableCell className="font-medium">Industrias XYZ</TableCell>
                  <TableCell>
                    <Badge variant="default">Cumplido</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="h-2 w-24 md:w-40" />
                      <span className="text-sm">95%</span>
                    </div>
                  </TableCell>
                  <TableCell>48/50</TableCell>
                  <TableCell>30/06/2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="eye" size={16} className="mr-2" />
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ABC Corp</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pendiente</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="h-2 w-24 md:w-40" />
                      <span className="text-sm">78%</span>
                    </div>
                  </TableCell>
                  <TableCell>35/45</TableCell>
                  <TableCell>15/06/2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="eye" size={16} className="mr-2" />
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Global Textil</TableCell>
                  <TableCell>
                    <Badge variant="destructive">En riesgo</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="h-2 w-24 md:w-40" />
                      <span className="text-sm">65%</span>
                    </div>
                  </TableCell>
                  <TableCell>26/40</TableCell>
                  <TableCell>05/06/2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="eye" size={16} className="mr-2" />
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCompliance;
