import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Database, Activity, Filter, Settings, Users, AlertTriangle, CheckCircle2, Clock, Database as DbIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import DataLakeDashboard from './DataLake/DataLakeDashboard';
import DataSourceConfig from './DataLake/DataSourceConfig';
import DataExplorer from './DataLake/DataExplorer';
import AccessControl from './DataLake/AccessControl';
import HelpTooltip from '@/components/HelpTooltip';

const DataLakeIntegration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Integración con DataLake</CardTitle>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Conectado
            </Badge>
          </div>
          <CardDescription>
            Gestione y aproveche sus datos ambientales a través de la plataforma DataLake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-primary mb-2">3.5TB</div>
              <div className="text-sm text-muted-foreground">Volumen de datos</div>
            </div>
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
              <div className="text-sm text-muted-foreground">Calidad de datos</div>
            </div>
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">56</div>
              <div className="text-sm text-muted-foreground">Fuentes conectadas</div>
            </div>
          </div>

          <Alert variant="default" className="bg-amber-50 border-amber-200 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Sincronización programada</AlertTitle>
            <AlertDescription className="text-amber-700">
              La próxima sincronización completa está programada para hoy a las 23:00h.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Panel de Control</span>
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center justify-center gap-2">
                <DbIcon className="h-4 w-4" />
                <span>Fuentes de Datos</span>
              </TabsTrigger>
              <TabsTrigger value="explorer" className="flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Explorador</span>
              </TabsTrigger>
              <TabsTrigger value="access" className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                <span>Permisos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DataLakeDashboard />
            </TabsContent>

            <TabsContent value="sources">
              <DataSourceConfig />
            </TabsContent>

            <TabsContent value="explorer">
              <DataExplorer />
            </TabsContent>

            <TabsContent value="access">
              <AccessControl />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataLakeIntegration;
