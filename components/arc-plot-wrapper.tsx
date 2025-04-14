'use client'

import dynamic from 'next/dynamic'
import { ArcPlotProps } from '@/components/arc-plot'

// Dynamically import ArcPlot with no SSR
const ArcPlot = dynamic(() => import('@/components/arc-plot').then(mod => mod.ArcPlot), {
  ssr: false
})

export function ArcPlotWrapper(props: ArcPlotProps) {
  return (
    <div className="max-w-7xl mx-auto h-full">
      <ArcPlot {...props} />
    </div>
  )
} 