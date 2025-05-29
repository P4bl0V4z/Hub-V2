
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CheckCheck, FileCheck, Package2, Shield, Truck } from 'lucide-react';

// Component imports
import ModulesHeader from '@/components/modules/ModulesHeader';
import ModulesTabs from '@/components/modules/ModulesTabs';
import GeneralModuleView from '@/components/modules/GeneralModuleView';
import RepModuleView from '@/components/modules/RepModuleView';
import FootprintModuleView from '@/components/modules/FootprintModuleView';
import PassportsModuleView from '@/components/modules/PassportsModuleView';
import PassportCreationDialog from '@/components/modules/PassportsModule/PassportCreationDialog';
import TimelineDialog from '@/components/modules/PassportsModule/TimelineDialog';

// Mock data
const mockProducts = [
  { id: 1, name: "Laptop Pro X1", sku: "LP-X1-2025", category: "Electrónicos", materials: ["Plástico", "Aluminio", "Componentes electrónicos"] },
  { id: 2, name: "Smartphone Galaxy", sku: "SG-2025", category: "Electrónicos", materials: ["Plástico", "Vidrio", "Componentes electrónicos", "Litio"] },
  { id: 3, name: "Botella de vidrio 500ml", sku: "BV-500", category: "Envases", materials: ["Vidrio", "Plástico"] },
  { id: 4, name: "Caja de cartón estándar", sku: "CCE-25", category: "Embalajes", materials: ["Cartón", "Tintas"] },
  { id: 5, name: "Bolsa reutilizable", sku: "BR-ECO", category: "Envases", materials: ["Polipropileno tejido", "Tintas ecológicas"] },
  { id: 6, name: "Bandeja de aluminio", sku: "BA-30", category: "Envases", materials: ["Aluminio"] }
];

const timelineEvents = [
  { id: 1, date: "15/04/2025", title: "Producción", description: "Producto fabricado en planta Santiago", icon: Package2 },
  { id: 2, date: "18/04/2025", title: "Control de calidad", description: "Producto verificado y certificado", icon: CheckCheck },
  { id: 3, date: "20/04/2025", title: "Centro de distribución", description: "Recepción en CD Norte", icon: Package2 },
  { id: 4, date: "22/04/2025", title: "Transporte", description: "En ruta hacia punto de venta", icon: Truck },
  { id: 5, date: "25/04/2025", title: "Punto de venta", description: "Disponible para el consumidor", icon: Shield }
];

// Datos para estadísticas de módulos en la sección General
const moduleStats = {
  rep: {
    active: true,
    lastUpdate: "05/05/2025",
    productsRegistered: 128,
    completeness: 85,
    recentActivities: [
      { date: "04/05/2025", description: "Actualización reporte mensual" },
      { date: "01/05/2025", description: "Carga de 12 nuevos productos" },
      { date: "28/04/2025", description: "Integración con GRANSIC completada" }
    ]
  },
  huella: {
    active: true,
    lastUpdate: "03/05/2025",
    productsAnalyzed: 45,
    completeness: 62,
    recentActivities: [
      { date: "03/05/2025", description: "Análisis de ciclo de vida completado para 5 SKUs" },
      { date: "25/04/2025", description: "Actualización factores de emisión" }
    ]
  },
  pasaportes: {
    active: true,
    lastUpdate: "01/05/2025",
    passportsCreated: 36,
    completeness: 48,
    recentActivities: [
      { date: "01/05/2025", description: "Creación de 8 nuevos pasaportes" },
      { date: "28/04/2025", description: "Actualización plantilla DPP" },
      { date: "22/04/2025", description: "Generación de códigos QR completada" }
    ]
  }
};

const RepMaterials = [
  { id: 1, name: "Cartón y Papel", quantity: 1250, unit: "Ton", yearToDate: 4800, target: 5000, trend: "+12%" },
  { id: 2, name: "Plásticos", quantity: 890, unit: "Ton", yearToDate: 3200, target: 3600, trend: "+8%" },
  { id: 3, name: "Vidrio", quantity: 760, unit: "Ton", yearToDate: 2800, target: 3000, trend: "+5%" },
  { id: 4, name: "Metales", quantity: 340, unit: "Ton", yearToDate: 1300, target: 1500, trend: "+3%" },
  { id: 5, name: "Tetra Pak", quantity: 180, unit: "Ton", yearToDate: 600, target: 720, trend: "-2%" }
];

const Modules = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedPassportProduct, setSelectedPassportProduct] = useState<string>("");
  const [showPassportCreationDialog, setShowPassportCreationDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <ModulesHeader 
            title="Módulos" 
            description="Gestión de módulos del sistema" 
          />
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ModulesTabs activeTab={activeTab} />
            
            {/* Sección General */}
            <TabsContent value="general">
              <GeneralModuleView 
                moduleStats={moduleStats}
                onTabChange={setActiveTab}
              />
            </TabsContent>
            
            {/* Módulo REP */}
            <TabsContent value="rep">
              <RepModuleView materials={RepMaterials} />
            </TabsContent>
            
            {/* Módulo Huella */}
            <TabsContent value="huella">
              <FootprintModuleView 
                products={mockProducts}
                selectedProduct={selectedProduct}
                onProductSelect={setSelectedProduct}
              />
            </TabsContent>
            
            {/* Módulo Pasaportes Digitales */}
            <TabsContent value="pasaportes">
              <PassportsModuleView 
                products={mockProducts}
                selectedProduct={selectedPassportProduct}
                onProductSelect={setSelectedPassportProduct}
                onCreatePassport={() => setShowPassportCreationDialog(true)}
                onOpenTimeline={() => setShowTimelineDialog(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Dialogs */}
      <PassportCreationDialog 
        open={showPassportCreationDialog}
        onOpenChange={setShowPassportCreationDialog}
        selectedProduct={selectedPassportProduct}
        products={mockProducts}
      />
      
      <TimelineDialog 
        open={showTimelineDialog}
        onOpenChange={setShowTimelineDialog}
        events={timelineEvents}
      />
    </div>
  );
};

export default Modules;
