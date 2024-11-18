import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '../types';
import { calculateDailyBalances } from '../utils/financeCalculations';
import { useTheme } from '@mui/material';

interface BarChartProps {
  monthlyTransactions: Transaction[]
}

const BarChart = ({monthlyTransactions}: BarChartProps) => {

  const theme = useTheme()

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '日別収支',
      },
    },
  };

  // 月のデータのみに成形
  const dailyBalances = calculateDailyBalances(monthlyTransactions)

  // 取引のある日付のみ取得
  const dateLabels = Object.keys(dailyBalances)

  // 取引データの支出を集計
  const expenseData = dateLabels.map((day) => dailyBalances[day].expense)

 // 取引データの収入を集計
  const incomeData = dateLabels.map((day) => dailyBalances[day].income)

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: '支出',
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.light,
      },
      {
        label: '収入',
        data: incomeData,
        backgroundColor: theme.palette.incomeColor.light,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export default BarChart