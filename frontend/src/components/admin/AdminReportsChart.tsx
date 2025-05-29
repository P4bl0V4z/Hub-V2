
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend
} from 'recharts';

// Datos mejorados para el gráfico con mejores formatos y valores más realistas
const generateChartData = (timeRange: string) => {
  let data = [];
  
  switch (timeRange) {
    case 'weekly':
      data = [
        { name: 'Lunes', usuarios: 152, sesiones: 204, documentos: 57, fecha: '01/05/2025' },
        { name: 'Martes', usuarios: 178, sesiones: 237, documentos: 68, fecha: '02/05/2025' },
        { name: 'Miércoles', usuarios: 193, sesiones: 261, documentos: 72, fecha: '03/05/2025' },
        { name: 'Jueves', usuarios: 201, sesiones: 285, documentos: 81, fecha: '04/05/2025' },
        { name: 'Viernes', usuarios: 187, sesiones: 252, documentos: 77, fecha: '05/05/2025' },
        { name: 'Sábado', usuarios: 116, sesiones: 157, documentos: 45, fecha: '06/05/2025' },
        { name: 'Domingo', usuarios: 92, sesiones: 124, documentos: 32, fecha: '07/05/2025' },
      ];
      break;
    case 'monthly':
      data = [
        { name: 'Semana 1', usuarios: 940, sesiones: 1350, documentos: 390, fecha: '01-07/05/2025' },
        { name: 'Semana 2', usuarios: 1020, sesiones: 1480, documentos: 420, fecha: '08-14/05/2025' },
        { name: 'Semana 3', usuarios: 980, sesiones: 1420, documentos: 405, fecha: '15-21/05/2025' },
        { name: 'Semana 4', usuarios: 1050, sesiones: 1520, documentos: 435, fecha: '22-28/05/2025' },
        { name: 'Semana 5', usuarios: 710, sesiones: 1020, documentos: 295, fecha: '29-31/05/2025' },
      ];
      break;
    case 'yearly':
      data = [
        { name: 'Enero', usuarios: 3520, sesiones: 5100, documentos: 1350, fecha: '01/2025' },
        { name: 'Febrero', usuarios: 3740, sesiones: 5420, documentos: 1430, fecha: '02/2025' },
        { name: 'Marzo', usuarios: 3960, sesiones: 5700, documentos: 1530, fecha: '03/2025' },
        { name: 'Abril', usuarios: 4180, sesiones: 6050, documentos: 1610, fecha: '04/2025' },
        { name: 'Mayo', usuarios: 4400, sesiones: 6400, documentos: 1720, fecha: '05/2025' },
        { name: 'Junio', usuarios: 4290, sesiones: 6200, documentos: 1670, fecha: '06/2025' },
        { name: 'Julio', usuarios: 4180, sesiones: 6050, documentos: 1610, fecha: '07/2025' },
        { name: 'Agosto', usuarios: 4070, sesiones: 5900, documentos: 1550, fecha: '08/2025' },
        { name: 'Septiembre', usuarios: 4510, sesiones: 6520, documentos: 1780, fecha: '09/2025' },
        { name: 'Octubre', usuarios: 4620, sesiones: 6700, documentos: 1820, fecha: '10/2025' },
        { name: 'Noviembre', usuarios: 4730, sesiones: 6850, documentos: 1860, fecha: '11/2025' },
        { name: 'Diciembre', usuarios: 4840, sesiones: 7000, documentos: 1920, fecha: '12/2025' },
      ];
      break;
    default:
      data = [
        { name: 'Semana 1', usuarios: 940, sesiones: 1350, documentos: 390, fecha: '01-07/05/2025' },
        { name: 'Semana 2', usuarios: 1020, sesiones: 1480, documentos: 420, fecha: '08-14/05/2025' },
        { name: 'Semana 3', usuarios: 980, sesiones: 1420, documentos: 405, fecha: '15-21/05/2025' },
        { name: 'Semana 4', usuarios: 1050, sesiones: 1520, documentos: 435, fecha: '22-28/05/2025' },
        { name: 'Semana 5', usuarios: 710, sesiones: 1020, documentos: 295, fecha: '29-31/05/2025' },
      ];
  }
  
  return data;
};

interface AdminReportsChartProps {
  timeRange: string;
}

const AdminReportsChart = ({ timeRange }: AdminReportsChartProps) => {
  const data = generateChartData(timeRange);
  
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorSesiones" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorDocumentos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat('es-ES').format(value)}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #eaeaea' }}
            formatter={(value, name) => {
              const translatedNames: Record<string, string> = {
                usuarios: 'Usuarios activos',
                sesiones: 'Sesiones',
                documentos: 'Docs. procesados'
              };
              return [new Intl.NumberFormat('es-ES').format(value as number), translatedNames[name] || name];
            }}
            labelFormatter={(label) => {
              const item = data.find(d => d.name === label);
              return `${label} (${item?.fecha || ''})`;
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              const translatedNames: Record<string, string> = {
                usuarios: 'Usuarios activos',
                sesiones: 'Sesiones',
                documentos: 'Docs. procesados'
              };
              return translatedNames[value] || value;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="usuarios" 
            stackId="1" 
            stroke="#8884d8" 
            fill="url(#colorUsuarios)" 
            fillOpacity={0.6} 
          />
          <Area 
            type="monotone" 
            dataKey="sesiones" 
            stackId="2" 
            stroke="#82ca9d" 
            fill="url(#colorSesiones)" 
            fillOpacity={0.6} 
          />
          <Area 
            type="monotone" 
            dataKey="documentos" 
            stackId="3" 
            stroke="#ffc658" 
            fill="url(#colorDocumentos)" 
            fillOpacity={0.6} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminReportsChart;
