
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Datos simulados para el gráfico de pastel
const data = [
  { name: 'Manufactura', value: 35, color: '#8884d8' },
  { name: 'Alimentos', value: 25, color: '#82ca9d' },
  { name: 'Retail', value: 20, color: '#ffc658' },
  { name: 'Textil', value: 12, color: '#ff8042' },
  { name: 'Otros', value: 8, color: '#0088fe' },
];

const AdminClientStats = () => {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} clientes`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminClientStats;
