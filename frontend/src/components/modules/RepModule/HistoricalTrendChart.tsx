
import React from 'react';
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, ComposedChart, Bar } from 'recharts';

// Historical trend data
const historicalData = [
  { month: 'Ene', actual: 1150, previous: 950, target: 1100 },
  { month: 'Feb', actual: 1250, previous: 1050, target: 1150 },
  { month: 'Mar', actual: 1340, previous: 1120, target: 1200 },
  { month: 'Abr', actual: 1410, previous: 1180, target: 1250 },
  { month: 'May', actual: 1520, previous: 1240, target: 1300 },
  { month: 'Jun', actual: 1590, previous: 1280, target: 1350 },
  { month: 'Jul', actual: 1680, previous: 1320, target: 1400 },
  { month: 'Ago', actual: 1750, previous: 1360, target: 1450 },
  { month: 'Sep', actual: 1820, previous: 1390, target: 1500 },
  { month: 'Oct', actual: 1910, previous: 1420, target: 1550 },
  { month: 'Nov', actual: 2080, previous: 1460, target: 1600 },
  { month: 'Dic', actual: 2200, previous: 1500, target: 1650 }
];

const HistoricalTrendChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={historicalData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DEFF" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#E5DEFF' }}
            tickLine={{ stroke: '#9b87f5' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#E5DEFF' }}
            tickLine={{ stroke: '#9b87f5' }}
            tickFormatter={(value) => `${value} Ton`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#E5DEFF' }}
            tickLine={{ stroke: '#9b87f5' }}
            tickFormatter={(value) => `${value} Ton`}
            hide
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded-md shadow-md">
                    <p className="font-medium">{data.month}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-sm">2025: <span className="font-medium">{data.actual} Ton</span></p>
                    </div>
                    <div className="flex gap-2 items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <p className="text-sm">2024: <span className="font-medium">{data.previous} Ton</span></p>
                    </div>
                    <div className="flex gap-2 items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                      <p className="text-sm">Meta: <span className="font-medium">{data.target} Ton</span></p>
                    </div>
                    <div className="mt-1 pt-1 border-t">
                      <p className="text-sm font-medium" style={{ color: '#22c55e' }}>
                        +{Math.round(((data.actual - data.previous) / data.previous) * 100)}% vs 2024
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconSize={8}
            iconType="circle"
            formatter={(value) => (
              <span style={{ fontSize: '10px' }}>
                {value === 'actual' ? '2025' : value === 'previous' ? '2024' : 'Meta'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#22c55e"
            strokeWidth={2}
            fill="#22c55e"
            fillOpacity={0.1}
            yAxisId="left"
            animationDuration={1000}
            dot={{ r: 2, fill: '#22c55e' }}
            activeDot={{ r: 4, fill: '#22c55e' }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#9b87f5"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            yAxisId="left"
            dot={{ r: 2, fill: '#9b87f5' }}
            activeDot={{ r: 4, fill: '#9b87f5' }}
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#F97316"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            yAxisId="left"
            dot={false}
          />
          <Bar
            dataKey="actual"
            yAxisId="right"
            barSize={0}
            fill="transparent"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalTrendChart;
