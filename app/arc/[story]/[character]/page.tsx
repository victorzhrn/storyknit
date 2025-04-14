import { notFound } from "next/navigation"
import { TimelineHeader } from "@/components/timeline-header"
import { TimelineContent } from "@/components/timeline-content"
import { ArcPlot } from "@/components/arc-plot"
import { Timeline } from "@/components/ui/timeline"
import type { TimelineHeaderProps } from "@/types/timeline"

interface CharacterArcProps {
  characterData: {
    metadata: {
      title: string
      description: string
      backgroundImage: string
    }
    name: string
    description: string
    plots: Array<{
      title: string
      structure: string
      intensity: number
      content: {
        mainText: string
        characterDevelopment?: Array<{
          character: string
          name: string
          text: string
        }>
        image?: {
          src: string
          alt: string
        }
      }
    }>
  }
}

function CharacterArc({ characterData }: CharacterArcProps) {
  const { metadata, name, description, plots } = characterData

  // Only process plots if they exist
  const hasPlots = plots && plots.length > 0

  // Transform the data to match the Timeline component's expected format
  const formattedData = hasPlots ? plots.map((plot) => ({
    title: plot.title,
    content: <TimelineContent content={plot.content} title={plot.title} />,
  })) : []

  // Transform plots data for ArcPlot
  const storyPoints = hasPlots ? plots.map(plot => ({
    title: plot.title,
    structure: plot.structure,
    intensity: plot.intensity
  })) : []

  return (
    <div className="w-full space-y-8">
      <TimelineHeader 
        title={name}
        description={description}
        backgroundImage={metadata.backgroundImage}
      />
      {hasPlots && (
        <>
          <div className="bg-white dark:bg-neutral-950 py-12 px-4 md:px-8 lg:px-10">
            <ArcPlot
              title={name}
              storyPoints={storyPoints}
            />
          </div>
          <Timeline data={formattedData} />
        </>
      )}
    </div>
  )
}

interface PageProps {
  params: {
    story: string
    character: string
  }
}

export default async function CharacterPage({ params }: PageProps) {
  const { story, character } = params

  try {
    // Try to import the story data
    const storyData = require(`@/data/story/${story}.json`)
    
    // Check if the character exists in the story data
    if (!storyData.character || !storyData.character[character]) {
      notFound()
    }

    return <CharacterArc characterData={storyData.character[character]} />
  } catch (error) {
    // If the story file doesn't exist, return 404
    notFound()
  }
}

// Generate static paths for all available stories and their characters
export async function generateStaticParams() {
  const fs = require("fs")
  const path = require("path")
  
  const storiesDir = path.join(process.cwd(), "data", "story")
  const storyFiles = fs.readdirSync(storiesDir)
  
  const params = []
  
  for (const file of storyFiles) {
    if (file.endsWith(".json")) {
      const story = file.replace(".json", "")
      const storyData = require(`@/data/story/${story}.json`)
      
      // Get all character keys from the story data
      if (storyData.character) {
        const characterKeys = Object.keys(storyData.character)
        for (const character of characterKeys) {
          params.push({
            story,
            character,
          })
        }
      }
    }
  }
  
  return params
} 