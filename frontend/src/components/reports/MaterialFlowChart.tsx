
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const materialFlowData = [
  { name: 'Materia Prima', value: 100, fill: '#D946EF' },
  { name: 'Procesamiento', value: 95, fill: '#8B5CF6' },
  { name: 'Manufactura', value: 90, fill: '#9b87f5' },
  { name: 'Distribución', value: 88, fill: '#0EA5E9' },
  { name: 'Consumo', value: 85, fill: '#F2FCE2' },
  { name: 'Reciclaje', value: 45, fill: '#22c55e' },
];

const MaterialFlowChart: React.FC = () => {
  return (
    <div className="h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={materialFlowData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 9 }}
            tickLine={{ stroke: '#9b87f5' }}
            axisLine={{ stroke: '#E5DEFF' }}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickLine={{ stroke: '#9b87f5' }}
            axisLine={{ stroke: '#E5DEFF' }}
            domain={[0, 100]}
            label={{ value: '%', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#8E9196', fontSize: 10 } }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded-md shadow-md">
                    <p className="font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm">{`${payload[0].value}% del material original`}</p>
                    {payload[0].payload.name === 'Reciclaje' && (
                      <p className="text-sm text-green-600 font-medium mt-1">Material recuperado para economía circular</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            barSize={20}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            {materialFlowData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaterialFlowChart;
