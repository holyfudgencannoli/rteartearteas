import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './SeasonalSpending.css'

export default function SeasonalSpending() {
  return (
    <div id='seasonal-spend-container'>
    <h2>Seasonal Spending</h2>
    <BarChart
      xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
      series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
      height={300}
    />
    </div>
  );
}