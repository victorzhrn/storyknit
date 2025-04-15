'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface StoryPoint {
  title: string;
  structure: string;
  intensity: number;
}

// Export the interface
export interface ArcPlotProps {
  /** Main title of the chart */
  title?: string;
  /** Array of story points */
  storyPoints: StoryPoint[];
  /** Optional className for the container */
  className?: string;
}

/**
 * ArcPlot component that renders a story arc chart using ECharts
 * @param props - Component props
 * @returns React component
 */
export function ArcPlot({
  title = 'Story Arc',
  storyPoints,
  className
}: ArcPlotProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Process story points to create intervals for each structure type
  const processStoryData = (points: StoryPoint[]) => {
    const totalPoints = points.length; // Calculate total points
    const halfPoints = Math.floor(totalPoints / 2); // Calculate half (integer)
    const numPointsToAlignRight = Math.min(5, halfPoints); // Determine N

    // Create data points as objects, starting from index 1
    const data = points.map((point, index) => {
      const item: {
        value: number[];
        label?: { align?: 'left' | 'right' }; // Define type for item
      } = {
        value: [index + 1, point.intensity],
      };

      // Add specific label alignment for the last N points
      if (index >= totalPoints - numPointsToAlignRight) {
        item.label = { align: 'right' };
      }

      return item;
    });

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
    if (!chartInstance.current || !chartRef.current) return;

    const { data, markAreas } = processStoryData(storyPoints);

    // Get initial chart width
    const chartWidth = chartRef.current.offsetWidth;

    const getChartOptions = (currentWidth: number): EChartsOption => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const index = params[0].value[0];
          if (index === 0) return 'Start';
          const point = storyPoints[index - 1];
          return `${point.title}<br/>Structure: ${point.structure}<br/>Intensity: ${point.intensity}`;
        },
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        top: currentWidth < 500 ? '2%' : '5%',
      },
      xAxis: {
        show: false,
        type: 'value',
        min: 0.5,
        max: storyPoints.length + 0.5,
        interval: 1,
        axisLabel: {
          formatter: function(value: number) {
            return Number.isInteger(value) ? value.toString() : '';
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        show: false,
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
            data: markAreas,
            label: {
              show: currentWidth >= 500 
            }
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
              const index = params.value[0] - 1;
              const fullTitle = storyPoints[index]?.title || '';
              if (currentWidth < 500 && fullTitle.length > 10) {
                return fullTitle.substring(0, 10) + '...';
              }
              return fullTitle;
            },
            position: 'bottom',
            distance: 5,
            rotate: 0,
            align: 'left',
            verticalAlign: 'middle',
            fontSize: 12,
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
    });

    // Set initial options
    chartInstance.current.setOption(getChartOptions(chartWidth));

    // Add click handler for plot points
    chartInstance.current.on('click', 'series.scatter', function(params: any) {
      const index = params.value[0] - 1;
      const plotTitle = storyPoints[index]?.title;
      
      if (plotTitle) {
        // Escape the title for use in CSS selector. Use CSS.escape if available.
        const escapedTitle = typeof CSS !== 'undefined' && CSS.escape 
          ? CSS.escape(plotTitle) 
          : plotTitle.replace(/["\\#.: C]/g, '\\$&'); // Basic fallback for key chars if CSS.escape is missing

        // Find the corresponding timeline entry using the properly escaped title
        const selector = `[data-plot-title="${escapedTitle}"]`;
        console.log(`[ArcPlot Click] Searching for selector: ${selector}`); // Debug log
        const timelineEntry = document.querySelector(selector);

        if (timelineEntry) {
          console.log(`[ArcPlot Click] Found element:`, timelineEntry); // Debug log
          timelineEntry.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.warn(`[ArcPlot Click] Element not found for title: "${plotTitle}" (escaped: "${escapedTitle}")`); // Debug log
        }
      } else {
         console.warn('[ArcPlot Click] plotTitle is undefined for clicked point.'); // Debug log
      }
    });

    // Handle window resize - Update options on resize
    const handleResize = () => {
      if (chartInstance.current && chartRef.current) {
        const newWidth = chartRef.current.offsetWidth;
        // Re-apply options with potentially new width logic
        chartInstance.current.setOption(getChartOptions(newWidth), false); // 'false' prevents option merging issues
        chartInstance.current.resize(); // Resize the chart canvas
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [title, storyPoints]);

  return (
    <div
      ref={chartRef}
      className={className ?? "w-full h-64 md:h-full"}
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