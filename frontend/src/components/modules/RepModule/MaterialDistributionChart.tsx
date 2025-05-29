
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  yearToDate: number;
  target: number;
  trend: string;
}

interface MaterialDistributionChartProps {
  materials: Material[];
}

const MaterialDistributionChart: React.FC<MaterialDistributionChartProps> = ({ materials }) => {
  const getBarColor = (index: number) => {
    const colors = ['#9b87f5', '#22c55e', '#0EA5E9', '#F97316', '#D946EF', '#8B5CF6'];
    return colors[index % colors.length];
  };
  
  const materialData = materials.map(material => ({
    name: material.name,
    cantidad: material.quantity,
    meta: material.target / 12, // Monthly target
    unidad: material.unit
  }));
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={materialData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barGap={8}
          barCategoryGap={16}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DEFF" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#E5DEFF' }}
            tickLine={{ stroke: '#9b87f5' }}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#E5DEFF' }}
            tickLine={{ stroke: '#9b87f5' }}
            tickFormatter={(value) => `${value} ${materials[0].unit}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded-md shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">Cantidad actual: <span className="font-medium">{data.cantidad} {data.unidad}</span></p>
                    <p className="text-sm">Meta mensual: <span className="font-medium">{data.meta} {data.unidad}</span></p>
                    <p className="text-sm font-medium" style={{ 
                      color: data.cantidad >= data.meta ? '#22c55e' : '#ef4444' 
                    }}>
                      {data.cantidad >= data.meta ? '✓ Meta cumplida' : '⚠ Por debajo de meta'}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconSize={10}
            iconType="circle"
            formatter={(value) => <span style={{ fontSize: '10px' }}>{value === 'cantidad' ? 'Cantidad Actual' : 'Meta Mensual'}</span>}
          />
          <Bar 
            dataKey="cantidad" 
            name="Cantidad Actual"
            barSize={20}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            {materialData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
          <Bar 
            dataKey="meta" 
            name="Meta Mensual"
            barSize={20}
            radius={[4, 4, 0, 0]}
            fill="#222"
            fillOpacity={0.3}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaterialDistributionChart;
