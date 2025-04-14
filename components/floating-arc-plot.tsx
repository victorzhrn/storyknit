"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArcPlotWrapper } from "./arc-plot-wrapper"
import { useMediaQuery } from "react-responsive"

interface FloatingArcPlotProps {
  title: string
  storyPoints: Array<{
    title: string
    structure: string
    intensity: number
  }>
}

export function FloatingArcPlot({ title, storyPoints }: FloatingArcPlotProps) {
  const [isFloating, setIsFloating] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })
  const isDesktop = useMediaQuery({ minWidth: 768 })

  useEffect(() => {
    setIsFloating(!inView && isDesktop)
  }, [inView, isDesktop])

  return (
    <>
      {/* Original Plot */}
      <div ref={ref} className="w-full">
        <ArcPlotWrapper title={title} storyPoints={storyPoints} />
      </div>

      {/* Floating Plot */}
      <AnimatePresence>
        {isFloating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "fixed",
              bottom: "1rem",
              left: "1rem",
              zIndex: 50,
              width: "25vw",
              height: "calc(25vw * 0.75)",
              maxWidth: "32rem",
              maxHeight: "24rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              padding: "1rem",
              backdropFilter: "blur(4px)",
              overflow: "hidden"
            }}
            className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-neutral-900/95 dark:to-neutral-950/95"
          >
            <div data-plot-title={title} className="w-full h-full">
              <ArcPlotWrapper 
                title={title} 
                storyPoints={storyPoints}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 