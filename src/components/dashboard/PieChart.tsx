
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { cn } from '@/lib/utils';

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  doughnut?: boolean;
}

const PieChart = ({ 
  data, 
  title, 
  height = 300, 
  className,
  showLegend = true,
  doughnut = false
}: PieChartProps) => {
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

    // Default colors if not provided
    const defaultColors = [
      'rgba(75, 112, 245, 0.8)', // blue
      'rgba(16, 185, 129, 0.8)', // green
      'rgba(251, 191, 36, 0.8)', // yellow
      'rgba(239, 68, 68, 0.8)',  // red
      'rgba(139, 92, 246, 0.8)', // purple
      'rgba(14, 165, 233, 0.8)', // sky
    ];

    const config: ChartConfiguration = {
      type: doughnut ? 'doughnut' : 'pie',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.backgroundColor || defaultColors,
          borderColor: dataset.borderColor || 'white',
          borderWidth: dataset.borderWidth || 2,
          hoverOffset: 10
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
        animation: {
          animateRotate: true,
          animateScale: true
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
  }, [data, title, showLegend, doughnut]);

  return (
    <div className={cn("chart-container p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md", className)}>
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
};

export default PieChart;
