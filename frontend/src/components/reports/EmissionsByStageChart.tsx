
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const lifecycleData = [
  { stage: 'Extracción de materias primas', impact: 28, unit: 'kg CO2 eq', percentage: 28, fill: '#D946EF' },
  { stage: 'Procesamiento y manufactura', impact: 35, unit: 'kg CO2 eq', percentage: 35, fill: '#8B5CF6' },
  { stage: 'Distribución', impact: 12, unit: 'kg CO2 eq', percentage: 12, fill: '#0EA5E9' },
  { stage: 'Uso', impact: 5, unit: 'kg CO2 eq', percentage: 5, fill: '#E5DEFF' },
  { stage: 'Fin de vida', impact: 20, unit: 'kg CO2 eq', percentage: 20, fill: '#F97316' },
];

const EmissionsByStageChart: React.FC = () => {
  return (
    <div className="h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={lifecycleData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            innerRadius={30}
            fill="#8884d8"
            dataKey="impact"
            nameKey="stage"
            label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
            paddingAngle={2}
          >
            {lifecycleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded-md shadow-md">
                    <p className="font-medium">{item.stage}</p>
                    <p className="text-sm">{`Impacto: ${item.impact} ${item.unit}`}</p>
                    <p className="text-sm">{`${item.percentage}% del total`}</p>
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

export default EmissionsByStageChart;
