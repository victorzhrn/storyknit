'use client'

import dynamic from 'next/dynamic'
import { ArcPlotProps } from '@/components/arc-plot'

// Dynamically import ArcPlot with no SSR
const ArcPlot = dynamic(() => import('@/components/arc-plot').then(mod => mod.ArcPlot), {
  ssr: false
})

// Extend props to include className
interface ArcPlotWrapperProps extends ArcPlotProps {
  className?: string;
}

export function ArcPlotWrapper({ className, ...props }: ArcPlotWrapperProps) { // Destructure className
  // Apply className to the outer div, provide default if none passed
  return (
    <div className={`max-w-7xl mx-auto h-full ${className || ''}`}>
      <ArcPlot {...props} />
    </div>
  )
} 