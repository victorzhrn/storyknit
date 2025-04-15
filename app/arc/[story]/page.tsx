import { notFound } from "next/navigation"
import { Timeline } from "@/components/ui/timeline"
import { TimelineHeader } from "@/components/timeline-header"
import { TimelineContent } from "@/components/timeline-content"
import type { TimelineEntry, TimelineContent as TimelineContentType } from "@/types/timeline"
import { FloatingArcPlot } from "@/components/floating-arc-plot"
import { Metadata } from "next"

interface StoryMetadata {
  title: string
  description: string
  backgroundImage?: string
}

interface StoryArcProps {
  storyData: {
    metadata: StoryMetadata
    timeline: (TimelineEntry & {
      structure: string
      intensity: number
    })[]
  }
}

function StoryArc({ storyData }: StoryArcProps) {
  const { metadata, timeline } = storyData

  // Transform timeline data for ArcPlot
  const storyPoints = timeline.map(entry => ({
    title: entry.title,
    structure: entry.structure,
    intensity: entry.intensity
  }))

  // Transform the data to match the Timeline component's expected format
  const formattedData = [
    // Prepend the Arc Plot as the first item
    {
      title: `Story Arc of ${metadata.title}`,
      content: (
        <div className="bg-white dark:bg-neutral-950">
          <FloatingArcPlot
            title={metadata.title}
            storyPoints={storyPoints}
          />
        </div>
      ),
    },
    // Map the rest of the timeline entries
    ...timeline.map((entry: TimelineEntry) => ({
      title: entry.title,
      content: <TimelineContent content={entry.content as TimelineContentType} title={entry.title} />,
    })),
  ]

  return (
    <div className="w-full space-y-8">
      <TimelineHeader
        title={metadata.title}
        description={metadata.description}
        backgroundImage={metadata.backgroundImage || undefined}
      />
      <Timeline data={formattedData} />
    </div>
  )
}

interface PageProps {
  params: Promise<{
    story: string
  }>
}

export default async function StoryPage({ params }: PageProps) {
  const { story } = await params

  try {
    // Try to import the story data
    const storyData = require(`@/data/story/${story}.json`)
    return <StoryArc storyData={storyData} />
  } catch (error) {
    // If the story file doesn't exist, return 404
    console.error(`Error loading story data for "${story}":`, error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { story } = await params

  try {
    const storyData = require(`@/data/story/${story}.json`)
    return {
      title: storyData.metadata.title,
      description: storyData.metadata.description,
      openGraph: {
        title: storyData.metadata.title,
        description: storyData.metadata.description,
        images: storyData.metadata.backgroundImage ? [storyData.metadata.backgroundImage] : [],
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for "${story}":`, error)
    return {
      title: 'Story Not Found',
      description: 'The requested story could not be found.',
    }
  }
}

// Generate static paths for all available stories
export async function generateStaticParams() {
  const fs = require("fs")
  const path = require("path")

  const storiesDir = path.join(process.cwd(), "data", "story")
  let storyFiles: string[] = [];
  try {
    storyFiles = fs.readdirSync(storiesDir);
  } catch (error) {
    console.error("Error reading stories directory:", error);
    // Return an empty array or handle the error as appropriate
    return [];
  }

  return storyFiles
    .filter((file: string) => file.endsWith(".json"))
    .map((file: string) => ({
      story: file.replace(".json", ""),
    }));
} 