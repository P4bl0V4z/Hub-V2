
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const wasteDistributionData = [
  { name: 'Reciclado', value: 45, fill: '#22c55e' },
  { name: 'Incinerado', value: 20, fill: '#F97316' },
  { name: 'Vertedero', value: 20, fill: '#ef4444' },
  { name: 'Reutilizado', value: 15, fill: '#0EA5E9' },
];

const WasteDistributionChart: React.FC = () => {
  return (
    <div className="h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={wasteDistributionData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {wasteDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded-md shadow-md">
                    <p className="font-medium">{payload[0].name}</p>
                    <p className="text-sm">{`${payload[0].value}% del total`}</p>
                    <p className="text-sm font-medium" style={{ 
                      color: payload[0].name === 'Reciclado' || payload[0].name === 'Reutilizado' ? '#22c55e' : '#666' 
                    }}>
                      {(payload[0].name === 'Reciclado' || payload[0].name === 'Reutilizado') ? '✓ Circular' : ''}
                    </p>
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

export default WasteDistributionChart;
