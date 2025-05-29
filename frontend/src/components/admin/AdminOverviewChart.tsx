
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Legend 
} from 'recharts';

// Datos mejorados para el gráfico con mejor formato y distribución
const generateChartData = (timeRange: string) => {
  let data = [];
  
  switch (timeRange) {
    case '24h':
      data = [
        { name: '00:00', visits: 240, logins: 120, transactions: 45, hora: '00:00 - 03:59' },
        { name: '04:00', visits: 120, logins: 60, transactions: 20, hora: '04:00 - 07:59' },
        { name: '08:00', visits: 380, logins: 220, transactions: 110, hora: '08:00 - 11:59' },
        { name: '12:00', visits: 520, logins: 320, transactions: 160, hora: '12:00 - 15:59' },
        { name: '16:00', visits: 650, logins: 380, transactions: 190, hora: '16:00 - 19:59' },
        { name: '20:00', visits: 470, logins: 270, transactions: 130, hora: '20:00 - 23:59' },
      ];
      break;
    case '7d':
      data = [
        { name: 'Lun', visits: 1240, logins: 820, transactions: 345, fecha: 'Lunes, 29/04' },
        { name: 'Mar', visits: 1380, logins: 920, transactions: 410, fecha: 'Martes, 30/04' },
        { name: 'Mié', visits: 1520, logins: 1020, transactions: 460, fecha: 'Miércoles, 01/05' },
        { name: 'Jue', visits: 1650, logins: 1180, transactions: 490, fecha: 'Jueves, 02/05' },
        { name: 'Vie', visits: 1470, logins: 970, transactions: 430, fecha: 'Viernes, 03/05' },
        { name: 'Sáb', visits: 980, logins: 670, transactions: 230, fecha: 'Sábado, 04/05' },
        { name: 'Dom', visits: 780, logins: 520, transactions: 180, fecha: 'Domingo, 05/05' },
      ];
      break;
    case '30d':
      data = [
        { name: 'Sem 1', visits: 8740, logins: 5220, transactions: 2345, fecha: '06/04 - 12/04' },
        { name: 'Sem 2', visits: 9380, logins: 5920, transactions: 2610, fecha: '13/04 - 19/04' },
        { name: 'Sem 3', visits: 8520, logins: 5020, transactions: 2260, fecha: '20/04 - 26/04' },
        { name: 'Sem 4', visits: 9650, logins: 6180, transactions: 2890, fecha: '27/04 - 05/05' },
      ];
      break;
    default:
      data = [
        { name: 'Lun', visits: 1240, logins: 820, transactions: 345, fecha: 'Lunes, 29/04' },
        { name: 'Mar', visits: 1380, logins: 920, transactions: 410, fecha: 'Martes, 30/04' },
        { name: 'Mié', visits: 1520, logins: 1020, transactions: 460, fecha: 'Miércoles, 01/05' },
        { name: 'Jue', visits: 1650, logins: 1180, transactions: 490, fecha: 'Jueves, 02/05' },
        { name: 'Vie', visits: 1470, logins: 970, transactions: 430, fecha: 'Viernes, 03/05' },
        { name: 'Sáb', visits: 980, logins: 670, transactions: 230, fecha: 'Sábado, 04/05' },
        { name: 'Dom', visits: 780, logins: 520, transactions: 180, fecha: 'Domingo, 05/05' },
      ];
  }
  
  return data;
};

interface AdminOverviewChartProps {
  timeRange: string;
}

const AdminOverviewChart = ({ timeRange }: AdminOverviewChartProps) => {
  const data = generateChartData(timeRange);
  
  const colors = {
    visits: "#9b87f5",
    logins: "#22c55e",
    transactions: "#F97316"
  };

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
          barGap={6} // Aumentado para evitar solapamientos
          barCategoryGap={20} // Aumentado para mejor separación entre grupos
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DEFF" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            tickMargin={10} 
            axisLine={{ stroke: "#E5DEFF" }}
          />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat('es-ES').format(value)}
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: "#E5DEFF" }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #eaeaea' }}
            formatter={(value, name) => {
              const translatedNames: Record<string, string> = {
                visits: 'Visitas',
                logins: 'Inicios de sesión',
                transactions: 'Transacciones'
              };
              return [new Intl.NumberFormat('es-ES').format(value as number), translatedNames[name] || name];
            }}
            labelFormatter={(label) => {
              const item = data.find(d => d.name === label);
              if (timeRange === '24h') {
                return `${item?.hora || ''}`;
              }
              return `${label} (${item?.fecha || ''})`;
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconSize={10}
            iconType="circle"
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => {
              const translatedNames: Record<string, string> = {
                visits: 'Visitas',
                logins: 'Inicios de sesión',
                transactions: 'Transacciones'
              };
              return translatedNames[value] || value;
            }}
          />
          <Bar 
            dataKey="visits" 
            name="visits" 
            fill={colors.visits} 
            radius={[4, 4, 0, 0]}
            barSize={12} // Barras más delgadas para evitar solapamiento
          />
          <Bar 
            dataKey="logins" 
            name="logins" 
            fill={colors.logins} 
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
          <Bar 
            dataKey="transactions" 
            name="transactions" 
            fill={colors.transactions} 
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminOverviewChart;
