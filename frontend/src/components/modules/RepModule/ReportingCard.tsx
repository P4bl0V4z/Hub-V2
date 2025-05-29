
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Download, Eye, FileBarChart, Info, BarChart, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import HelpTooltip from "@/components/HelpTooltip";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { 
  exportToExcel, 
  formatRegulatoryReportsForExport, 
  formatGransicReportsForExport 
} from "@/utils/excelExport";

const ReportingCard = () => {
  // Datos de ejemplo para los reportes
  const reportStats = {
    reportesRegulatorios: { 
      ultimaActualizacion: "30/04/2025",
      completados: 12,
      total: 12,
      estatus: "Actualizado"
    },
    informesGransic: { 
      ultimaActualizacion: "15/04/2025",
      completados: 5,
      total: 6,
      estatus: "Pendiente validación"
    },
    panelCumplimiento: { 
      ultimaActualizacion: "05/05/2025",
      completados: 100,
      total: 100,
      estatus: "En tiempo real"
    }
  };

  // Nuevos datos de visualización
  const cumplimientoData = [
    { periodo: 'Q1', valor: 92 },
    { periodo: 'Q2', valor: 95 },
    { periodo: 'Q3', valor: 97 },
    { periodo: 'Actual', valor: 95 },
  ];

  // Handle exports for different report types
  const handleRegulatoryReportsExport = () => {
    const data = formatRegulatoryReportsForExport();
    exportToExcel(
      data, 
      'Reportes_Regulatorios_REP', 
      'Reportes Regulatorios',
      { 'Tipo de Reporte': 25, 'Periodo': 15, 'Fecha Generación': 20 }
    );
    toast.success("Reportes regulatorios exportados correctamente");
  };

  const handleGransicReportsExport = () => {
    const data = formatGransicReportsForExport();
    exportToExcel(
      data, 
      'Informes_GRANSIC', 
      'Informes GRANSIC',
      { 'Tipo de Informe': 30, 'Observaciones': 40 }
    );
    toast.success("Informes GRANSIC exportados correctamente");
  };

  const handleComplianceDashboardExport = () => {
    // Combine all data for a comprehensive dashboard export
    const regulatoryData = formatRegulatoryReportsForExport();
    const gransicData = formatGransicReportsForExport();
    
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Add regulatory reports sheet
    const wsRegulatory = XLSX.utils.json_to_sheet(regulatoryData);
    XLSX.utils.book_append_sheet(wb, wsRegulatory, 'Reportes Regulatorios');
    
    // Add GRANSIC reports sheet
    const wsGransic = XLSX.utils.json_to_sheet(gransicData);
    XLSX.utils.book_append_sheet(wb, wsGransic, 'Informes GRANSIC');
    
    // Add KPI summary sheet
    const kpiData = [
      { 'Indicador': 'Cumplimiento general', 'Valor': '95%', 'Tendencia': '+3% vs Q1' },
      { 'Indicador': 'Valorización', 'Valor': '88%', 'Tendencia': '+2% vs 2024' },
      { 'Indicador': 'Reportes completados', 'Valor': '12/12', 'Tendencia': '100%' },
      { 'Indicador': 'Informes GRANSIC', 'Valor': '5/6', 'Tendencia': '83%' }
    ];
    const wsKpi = XLSX.utils.json_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(wb, wsKpi, 'KPIs Cumplimiento');
    
    // Generate file and trigger download
    XLSX.writeFile(wb, 'Panel_Cumplimiento_REP.xlsx');
    toast.success("Panel de cumplimiento exportado correctamente");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          Reportabilidad REP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/10">
            <h3 className="font-medium mb-1 flex items-center">
              Reportes Regulatorios
              <HelpTooltip 
                useHoverCard={true}
                title="Reportes Regulatorios" 
                content="Reportes obligatorios para autoridades reguladoras, actualizados mensualmente." 
              />
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Generación automatizada de reportes para autoridades
            </p>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Informes completados</span>
                <span className="font-medium">{reportStats.reportesRegulatorios.completados}/{reportStats.reportesRegulatorios.total}</span>
              </div>
              <Progress value={100} className="h-1.5" indicatorClassName="bg-green-500" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm">Último: {reportStats.reportesRegulatorios.ultimaActualizacion}</span>
                <Badge className="ml-2 bg-green-500/20 text-green-700 hover:bg-green-500/30">
                  {reportStats.reportesRegulatorios.estatus}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleRegulatoryReportsExport}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Descargar
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Ver reportes
                </Button>
              </div>
            </div>

            {/* Visualización pequeña de datos */}
            <div className="mt-3 pt-3 border-t border-dashed border-muted-foreground/20">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Tendencia de cumplimiento</span>
                <span className="text-xs font-medium text-green-600">+3% vs Q1</span>
              </div>
              <div className="flex items-end h-[30px] mt-2 space-x-2">
                {cumplimientoData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`w-10 ${
                        item.periodo === 'Actual' ? 'bg-green-500' : 'bg-indigo-400/70'
                      } rounded-t`} 
                      style={{ height: `${item.valor * 0.3}px` }}
                    ></div>
                    <span className="text-[10px] mt-1">{item.periodo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/10">
            <h3 className="font-medium mb-1 flex items-center">
              Informes para GRANSIC
              <HelpTooltip 
                useHoverCard={true}
                title="Informes GRANSIC" 
                content="Documentación requerida por los sistemas colectivos de gestión para la validación de cumplimiento." 
              />
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Documentación para sistemas colectivos de gestión
            </p>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Informes completados</span>
                <span className="font-medium">{reportStats.informesGransic.completados}/{reportStats.informesGransic.total}</span>
              </div>
              <Progress 
                value={Math.round((reportStats.informesGransic.completados / reportStats.informesGransic.total) * 100)} 
                className="h-1.5" 
                indicatorClassName="bg-orange-500" 
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm">Último: {reportStats.informesGransic.ultimaActualizacion}</span>
                <Badge className="ml-2 bg-orange-500/20 text-orange-700 hover:bg-orange-500/30">
                  {reportStats.informesGransic.estatus}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleGransicReportsExport}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Descargar
                </Button>
                <Button size="sm" variant="outline">
                  <FileBarChart className="h-3.5 w-3.5 mr-1" />
                  Ver informes
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/10">
            <h3 className="font-medium mb-1 flex items-center">
              Panel de Cumplimiento
              <HelpTooltip 
                useHoverCard={true}
                title="Panel de Cumplimiento" 
                content="Panel interactivo con visualización de KPIs de cumplimiento REP en tiempo real." 
              />
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Dashboard con indicadores de cumplimiento REP
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 bg-indigo-100/50 p-2 rounded">
                <BarChart className="h-4 w-4 text-indigo-600" />
                <div>
                  <div className="text-xs text-muted-foreground">Cumplimiento</div>
                  <div className="font-medium text-sm">95%</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-100/50 p-2 rounded">
                <LineChart className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-xs text-muted-foreground">Valorización</div>
                  <div className="font-medium text-sm">88%</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm">Estado: Actualizado</span>
                <Badge className="ml-2 bg-indigo-500/20 text-indigo-700 hover:bg-indigo-500/30">
                  {reportStats.panelCumplimiento.estatus}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleComplianceDashboardExport}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Exportar
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Ver panel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingCard;
