
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { cn } from '@/lib/utils';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      borderWidth?: number;
      tension?: number;
      fill?: boolean;
    }[];
  };
  title?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

const LineChart = ({ 
  data, 
  title, 
  height = 300, 
  className,
  showLegend = true 
}: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.borderColor || '#4B70F5',
          backgroundColor: dataset.backgroundColor || 'rgba(75, 112, 245, 0.1)',
          borderWidth: dataset.borderWidth || 2,
          tension: dataset.tension || 0.4,
          fill: dataset.fill !== undefined ? dataset.fill : true,
          pointRadius: 3,
          pointHoverRadius: 5,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: showLegend,
            position: 'top',
          },
          title: {
            display: !!title,
            text: title || '',
            padding: {
              top: 10,
              bottom: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 10,
            cornerRadius: 8,
            caretSize: 6,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6B7280',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#6B7280',
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        animation: {
          duration: 1000,
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    // Clean up on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, showLegend]);

  return (
    <div className={cn("chart-container p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md", className)}>
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
};

export default LineChart;
