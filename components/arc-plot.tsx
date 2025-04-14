'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface StoryPoint {
  title: string;
  structure: string;
  intensity: number;
}

interface ArcPlotProps {
  /** Main title of the chart */
  title?: string;
  /** Array of story points */
  storyPoints: StoryPoint[];
}

/**
 * ArcPlot component that renders a story arc chart using ECharts
 * @param props - Component props
 * @returns React component
 */
export function ArcPlot({
  title = 'Story Arc',
  storyPoints,
}: ArcPlotProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Process story points to create intervals for each structure type
  const processStoryData = (points: StoryPoint[]) => {
    // Create data points starting from index 1
    const data = points.map((point, index) => [index + 1, point.intensity]);
    
    // Create intervals for each structure type with extended ranges
    const markAreas: Array<[any, any]> = [];
    let currentStructure = points[0].structure;
    let startIndex = 0;

    for (let i = 1; i <= points.length; i++) {
      if (i === points.length || points[i]?.structure !== currentStructure) {
        markAreas.push([
          {
            name: currentStructure,
            xAxis: startIndex + 0.5,
            itemStyle: {
              color: getColorForStructure(currentStructure)
            }
          },
          {
            xAxis: i + 0.5
          }
        ]);
        
        if (i < points.length) {
          currentStructure = points[i].structure;
          startIndex = i;
        }
      }
    }

    return { data, markAreas };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const { data, markAreas } = processStoryData(storyPoints);

    const option: EChartsOption = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const index = params[0].data[0];
          if (index === 0) return 'Start';
          const point = storyPoints[index - 1];
          return `${point.title}<br/>Structure: ${point.structure}<br/>Intensity: ${point.intensity}`;
        },
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        top: '15%',
      },
      xAxis: {
        type: 'value',
        min: 0.5,
        max: storyPoints.length + 0.5,
        interval: 1,
        axisLabel: {
          formatter: function(value: number) {
            // Only show labels for integer values
            return Number.isInteger(value) ? value.toString() : '';
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          show: false
        },
        axisPointer: {
          snap: true,
        },
      },
      series: [
        {
          name: 'Story Intensity',
          type: 'line',
          smooth: true,
          data: data,
          markArea: {
            silent: true,
            data: markAreas
          },
        },
        {
          name: 'Plot Points',
          type: 'scatter',
          data: data,
          symbolSize: 8,
          label: {
            show: true,
            formatter: function(params: any) {
              const index = params.data[0] - 1;
              return storyPoints[index]?.title || '';
            },
            position: 'bottom',
            distance: 5,
            rotate: 0,
            align: 'left',
            verticalAlign: 'middle',
            fontSize: 14,
            color: '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            padding: [2, 4, 2, 4],
            borderRadius: 3,
            offset: [0, 0]
          },
          emphasis: {
            label: {
              show: true,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: '#000',
              fontWeight: 'bold'
            }
          }
        }
      ],
    };

    chartInstance.current.setOption(option);

    // Add click handler for plot points
    chartInstance.current.on('click', 'series.scatter', function(params: any) {
      const index = params.data[0] - 1;
      const plotTitle = storyPoints[index]?.title;
      if (plotTitle) {
        // Find the corresponding timeline entry and scroll to it
        const timelineEntry = document.querySelector(`[data-plot-title="${plotTitle}"]`);
        if (timelineEntry) {
          timelineEntry.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Handle window resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [title, storyPoints]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-[32rem]" 
    />
  );
}

// Helper function to get color based on structure type using Tailwind CSS colors
function getColorForStructure(structure: string): string {
  const colors: Record<string, string> = {
    'Exposition': 'rgba(134, 239, 172, 0.2)', // Tailwind green-300
    'Inciting Incident': 'rgba(251, 191, 36, 0.2)', // Tailwind amber-400
    'Progressive Complications': 'rgba(251, 146, 60, 0.2)', // Tailwind orange-400
    'Crisis': 'rgba(249, 115, 22, 0.2)', // Tailwind orange-500
    'Climax': 'rgba(239, 68, 68, 0.2)', // Tailwind red-500
    'Resolution': 'rgba(156, 163, 175, 0.2)', // Tailwind gray-400
  };
  return colors[structure] || 'rgba(200, 200, 200, 0.2)';
} 