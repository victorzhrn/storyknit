import { notFound } from "next/navigation"
import { Timeline } from "@/components/ui/timeline"
import { TimelineHeader } from "@/components/timeline-header"
import { TimelineContent } from "@/components/timeline-content"
import type { TimelineEntry } from "@/types/timeline"
import { FloatingArcPlot } from "@/components/floating-arc-plot"

interface StoryArcProps {
  storyData: {
    metadata: {
      title: string
      description: string
      backgroundImage: string
    }
    timeline: (TimelineEntry & {
      structure: string
      intensity: number
    })[]
  }
}

function StoryArc({ storyData }: StoryArcProps) {
  const { metadata, timeline } = storyData

  // Transform the data to match the Timeline component's expected format
  const formattedData = timeline.map((entry: TimelineEntry) => ({
    title: entry.title,
    content: <TimelineContent content={entry.content} title={entry.title} />,
  }))

  // Transform timeline data for ArcPlot
  const storyPoints = timeline.map(entry => ({
    title: entry.title,
    structure: entry.structure,
    intensity: entry.intensity
  }))

  return (
    <div className="w-full space-y-8">
      <TimelineHeader {...metadata} />
      <div className="bg-white dark:bg-neutral-950 py-12 px-4 md:px-8 lg:px-10">
        <FloatingArcPlot
          title={metadata.title}
          storyPoints={storyPoints}
        />
      </div>
      <Timeline data={formattedData} />
    </div>
  )
}

interface PageProps {
  params: {
    story: string
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { story } = params

  try {
    // Try to import the story data
    const storyData = require(`@/data/story/${story}.json`)
    return <StoryArc storyData={storyData} />
  } catch (error) {
    // If the story file doesn't exist, return 404
    notFound()
  }
}

// Generate static paths for all available stories
export async function generateStaticParams() {
  const fs = require("fs")
  const path = require("path")
  
  const storiesDir = path.join(process.cwd(), "data", "story")
  const storyFiles = fs.readdirSync(storiesDir)
  
  return storyFiles
    .filter((file: string) => file.endsWith(".json"))
    .map((file: string) => ({
      story: file.replace(".json", ""),
    }))
} 