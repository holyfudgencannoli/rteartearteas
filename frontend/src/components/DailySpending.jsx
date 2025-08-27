import { LineChart } from '@mui/x-charts/LineChart';

export default function() {

  return (
    <LineChart
      xAxis={[{ scaleType: 'band' , data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5, 7],
          area: true,
        },
      ]}
      height={300}
    />
  );
}
