
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Enhanced circularity data with additional metrics and trends
const circularityData = [
  { name: 'Material Reciclado', value: 45, fill: '#9b87f5', trend: '+8%', submetrics: [
    { name: 'Post-consumo', value: 32 },
    { name: 'Pre-consumo', value: 13 }
  ]},
  { name: 'Material Recuperable', value: 35, fill: '#0EA5E9', trend: '+5%', submetrics: [
    { name: 'Compostable', value: 15 },
    { name: 'Reutilizable', value: 20 }
  ]},
  { name: 'No Recuperable', value: 20, fill: '#F97316', trend: '-3%', submetrics: [
    { name: 'No reciclable', value: 12 },
    { name: 'Contaminado', value: 8 }
  ]}
];

const CircularityChart: React.FC = () => {
  return (
    <div className="h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={circularityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            // Usar sólo el porcentaje para evitar solapamiento
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {circularityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded-md shadow-md">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm">{`${item.value}% del total`}</p>
                    <p className="text-sm font-medium" style={{ 
                      color: item.trend.includes('+') ? '#22c55e' : '#ef4444' 
                    }}>
                      Tendencia: {item.trend}
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-medium">Desglose:</p>
                      {item.submetrics.map((submetric, idx) => (
                        <div key={idx} className="flex justify-between text-xs mt-1">
                          <span>{submetric.name}:</span>
                          <span>{submetric.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CircularityChart;
