import * as XLSX from 'xlsx';

// Function to convert data to Excel file and trigger download
export const exportToExcel = (
  data: any[], 
  fileName: string = 'export', 
  sheetName: string = 'Sheet1',
  columnWidths?: { [key: string]: number },
  styles?: any[][] // Changed from XLSX.CellStyle[][] to any[][] to avoid type error
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Apply column widths if provided
  if (columnWidths) {
    ws['!cols'] = Object.keys(columnWidths).map(key => ({ wch: columnWidths[key] }));
  }
  
  // Apply styles if provided (for cell formatting)
  if (styles) {
    ws['!styles'] = styles;
  }
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate the Excel file and trigger download
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Helper function for creating a multi-sheet workbook
export const exportMultipleSheets = (
  sheets: { name: string; data: any[] }[],
  fileName: string = 'export'
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Add each sheet to the workbook
  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });
  
  // Generate the Excel file and trigger download
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Helper function to format material data for export
export const formatMaterialsForExport = (materials: any[]) => {
  return materials.map(material => ({
    'Material': material.name,
    'Cantidad': material.quantity,
    'Unidad': material.unit,
    'Acumulado Anual': material.yearToDate,
    'Meta Anual': material.target,
    'Progreso (%)': Math.round((material.yearToDate / material.target) * 100),
    'Tendencia': material.trend,
    'Riesgo Suministro': material.risks?.supply || 'N/A',
    'Riesgo Cumplimiento': material.risks?.compliance || 'N/A',
    'Riesgo Costo': material.risks?.cost || 'N/A',
    'Clasificación': material.details?.classification || 'N/A',
    'Reciclabilidad (%)': material.details?.recyclability || 'N/A',
    'Origen': material.details?.origin || 'N/A',
  }));
};

// Helper function for regulatory report exports
export const formatRegulatoryReportsForExport = () => {
  // Example structure for regulatory reports
  const currentDate = new Date().toLocaleDateString();
  
  return [
    {
      'Tipo de Reporte': 'Informe Mensual REP',
      'Periodo': `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      'Fecha Generación': currentDate,
      'Estado': 'Completado',
      'Materiales Reportados': 5,
      'Toneladas Totales': 3420,
      'Cumplimiento (%)': 95,
    },
    {
      'Tipo de Reporte': 'Informe Trimestral REP',
      'Periodo': `Q${Math.ceil((new Date().getMonth() + 1) / 3)}/${new Date().getFullYear()}`,
      'Fecha Generación': currentDate,
      'Estado': 'Completado',
      'Materiales Reportados': 5,
      'Toneladas Totales': 9800,
      'Cumplimiento (%)': 92,
    },
    {
      'Tipo de Reporte': 'Declaración Anual',
      'Periodo': new Date().getFullYear().toString(),
      'Fecha Generación': '15/01/2025',
      'Estado': 'En Preparación',
      'Materiales Reportados': 5,
      'Toneladas Totales': 0,
      'Cumplimiento (%)': 0,
    }
  ];
};

// Helper function for GRANSIC reports export
export const formatGransicReportsForExport = () => {
  return [
    {
      'Tipo de Informe': 'Caracterización de Productos',
      'Periodo': 'Enero-Abril 2025',
      'Fecha Envío': '15/04/2025',
      'Estado': 'Enviado',
      'Sistema': 'GRANSIC Nacional',
      'Materiales Incluidos': 'Plásticos, Papel/Cartón, Vidrio',
      'Observaciones': 'Aprobado con comentarios menores',
    },
    {
      'Tipo de Informe': 'Trazabilidad de Gestores',
      'Periodo': 'Enero-Abril 2025',
      'Fecha Envío': '15/04/2025',
      'Estado': 'Enviado',
      'Sistema': 'GRANSIC Nacional',
      'Materiales Incluidos': 'Plásticos, Papel/Cartón, Vidrio, Metales',
      'Observaciones': 'Pendiente de validación',
    },
    {
      'Tipo de Informe': 'Declaración de Productos',
      'Periodo': 'Mayo 2025',
      'Fecha Envío': 'Pendiente',
      'Estado': 'En Preparación',
      'Sistema': 'GRANSIC Nacional',
      'Materiales Incluidos': 'Todos',
      'Observaciones': 'Plazo: 15/06/2025',
    }
  ];
};

// Helper function for baseline data export
export const formatBaselineDataForExport = () => {
  return [
    {
      'Material': 'Cartón y Papel',
      'Línea Base 2023 (Ton)': 4500,
      'Meta 2023 (%)': 70,
      'Meta 2023 (Ton)': 3150,
      'Línea Base 2024 (Ton)': 4800,
      'Meta 2024 (%)': 75,
      'Meta 2024 (Ton)': 3600,
      'Línea Base 2025 (Ton)': 5000,
      'Meta 2025 (%)': 75,
      'Meta 2025 (Ton)': 3750,
    },
    {
      'Material': 'Plásticos',
      'Línea Base 2023 (Ton)': 3000,
      'Meta 2023 (%)': 40,
      'Meta 2023 (Ton)': 1200,
      'Línea Base 2024 (Ton)': 3200,
      'Meta 2024 (%)': 45,
      'Meta 2024 (Ton)': 1440,
      'Línea Base 2025 (Ton)': 3600,
      'Meta 2025 (%)': 45,
      'Meta 2025 (Ton)': 1620,
    },
    {
      'Material': 'Vidrio',
      'Línea Base 2023 (Ton)': 2600,
      'Meta 2023 (%)': 55,
      'Meta 2023 (Ton)': 1430,
      'Línea Base 2024 (Ton)': 2800,
      'Meta 2024 (%)': 60,
      'Meta 2024 (Ton)': 1680,
      'Línea Base 2025 (Ton)': 3000,
      'Meta 2025 (%)': 60,
      'Meta 2025 (Ton)': 1800,
    },
    {
      'Material': 'Metales',
      'Línea Base 2023 (Ton)': 1200,
      'Meta 2023 (%)': 50,
      'Meta 2023 (Ton)': 600,
      'Línea Base 2024 (Ton)': 1300,
      'Meta 2024 (%)': 55,
      'Meta 2024 (Ton)': 715,
      'Línea Base 2025 (Ton)': 1500,
      'Meta 2025 (%)': 60,
      'Meta 2025 (Ton)': 900,
    },
    {
      'Material': 'Tetra Pak',
      'Línea Base 2023 (Ton)': 550,
      'Meta 2023 (%)': 30,
      'Meta 2023 (Ton)': 165,
      'Línea Base 2024 (Ton)': 600,
      'Meta 2024 (%)': 35,
      'Meta 2024 (Ton)': 210,
      'Línea Base 2025 (Ton)': 720,
      'Meta 2025 (%)': 40,
      'Meta 2025 (Ton)': 288,
    }
  ];
};

// --- NUEVAS FUNCIONES PARA LOS MÓDULOS HUELLA Y PASAPORTES ---

// Helper function for exporting carbon footprint data
export const formatFootprintDataForExport = (product?: { name: string; sku: string; }) => {
  // Datos de ejemplo para la huella de carbono
  const currentDate = new Date().toLocaleDateString();
  const productName = product?.name || 'Producto genérico';
  const productSku = product?.sku || 'SKU-123';
  
  return [
    {
      'Producto': productName,
      'SKU': productSku,
      'Fecha Análisis': currentDate,
      'Huella Total (kg CO2e)': 850,
      'Materias Primas (kg CO2e)': 320,
      'Manufactura (kg CO2e)': 250,
      'Distribución (kg CO2e)': 180,
      'Uso (kg CO2e)': 50,
      'Fin de Vida (kg CO2e)': 50,
      'Unidad Funcional': '1 unidad',
      'Metodología': 'ISO 14067',
      'Certificación': 'Pendiente',
    },
    {
      'Producto': productName,
      'SKU': productSku,
      'Fecha Análisis': '20/04/2025',
      'Huella Total (kg CO2e)': 920,
      'Materias Primas (kg CO2e)': 350,
      'Manufactura (kg CO2e)': 270,
      'Distribución (kg CO2e)': 190,
      'Uso (kg CO2e)': 55,
      'Fin de Vida (kg CO2e)': 55,
      'Unidad Funcional': '1 unidad',
      'Metodología': 'ISO 14067',
      'Certificación': 'No verificado',
    }
  ];
};

// Helper function for exporting eco-labeling data
export const formatEcoLabelingDataForExport = (product?: { name: string; sku: string; }) => {
  const productName = product?.name || 'Producto genérico';
  const productSku = product?.sku || 'SKU-123';
  
  return [
    {
      'Producto': productName,
      'SKU': productSku,
      'Tipo Etiqueta': 'Huella de Carbono',
      'Estándar': 'ISO 14067',
      'Valor': '850 kg CO2e',
      'Estado': 'Verificado',
      'Fecha Verificación': '15/04/2025',
      'Organismo Verificador': 'Carbon Trust',
      'Validez': '15/04/2027',
    },
    {
      'Producto': productName,
      'SKU': productSku,
      'Tipo Etiqueta': 'Huella Hídrica',
      'Estándar': 'ISO 14046',
      'Valor': '1250 L',
      'Estado': 'En proceso',
      'Fecha Verificación': 'N/A',
      'Organismo Verificador': 'N/A',
      'Validez': 'N/A',
    },
    {
      'Producto': productName,
      'SKU': productSku,
      'Tipo Etiqueta': 'Contenido Reciclado',
      'Estándar': 'ISO 14021',
      'Valor': '35%',
      'Estado': 'Auto-declarado',
      'Fecha Verificación': '01/01/2025',
      'Organismo Verificador': 'Auto-verificación',
      'Validez': '01/01/2026',
    }
  ];
};

// Helper function for exporting product passports data
export const formatProductPassportsForExport = (product?: { name: string; sku: string; }) => {
  const productName = product?.name || 'Producto genérico';
  const productSku = product?.sku || 'SKU-123';
  
  return [
    {
      'Producto': productName,
      'SKU': productSku,
      'ID Pasaporte': `PAS-${productSku}-001`,
      'Fecha Creación': '15/04/2025',
      'Estatus': 'Activo',
      'Estándar': 'ESPR (UE)',
      'Materiales Principales': 'Plástico, Aluminio, Componentes electrónicos',
      'Circularidad (%)': 42,
      'Reparabilidad (0-10)': 8,
      'URL Pasaporte': `https://company.com/passports/${productSku}`,
      'Fecha Actualización': '15/04/2025',
    }
  ];
};

// Helper function for exporting passport timeline events
export const formatPassportTimelineForExport = (events: any[]) => {
  return events.map(event => ({
    'Fecha': event.date,
    'Evento': event.title,
    'Descripción': event.description,
    'Tipo': event.icon?.name || 'Evento estándar',
    'Ubicación': event.location || 'N/A',
    'Responsable': event.responsible || 'Sistema',
  }));
};

// Helper function for exporting comprehensive product data
export const exportComprehensiveProductData = (product: { name: string; sku: string; }, events: any[] = []) => {
  const sheets = [
    {
      name: 'Información General',
      data: [
        {
          'Producto': product.name,
          'SKU': product.sku,
          'Categoría': 'Electrónicos',
          'Fecha Creación': '01/01/2025',
          'Estado': 'Activo',
          'Responsable': 'Juan Pérez',
        }
      ]
    },
    {
      name: 'Huella Ambiental',
      data: formatFootprintDataForExport(product)
    },
    {
      name: 'Etiquetas Ecológicas',
      data: formatEcoLabelingDataForExport(product)
    },
    {
      name: 'Pasaporte Digital',
      data: formatProductPassportsForExport(product)
    },
    {
      name: 'Trazabilidad',
      data: formatPassportTimelineForExport(events)
    }
  ];
  
  // Create and download the multi-sheet workbook
  exportMultipleSheets(sheets, `Datos_Completos_${product.sku}`);
};
