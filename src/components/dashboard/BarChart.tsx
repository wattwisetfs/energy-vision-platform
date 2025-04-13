
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { cn } from '@/lib/utils';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      stack?: string;
    }[];
  };
  title?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  stacked?: boolean;
}

const BarChart = ({ 
  data, 
  title,
  height = 300, 
  className,
  showLegend = true,
  stacked = false
}: BarChartProps) => {
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
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor || '#4B70F5',
          borderColor: dataset.borderColor || 'transparent',
          borderWidth: dataset.borderWidth || 1,
          borderRadius: 4,
          stack: stacked ? dataset.stack || 'default' : undefined,
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
            stacked: stacked,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#6B7280',
            },
          },
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
  }, [data, title, showLegend, stacked]);

  return (
    <div className={cn("chart-container p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md", className)}>
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
};

export default BarChart;
