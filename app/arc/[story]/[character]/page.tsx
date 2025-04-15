import { notFound } from "next/navigation"
import { TimelineHeader } from "@/components/timeline-header"
import { TimelineContent } from "@/components/timeline-content"
import { FloatingArcPlot } from "@/components/floating-arc-plot"
import { Timeline } from "@/components/ui/timeline"
import type { TimelineContent as TimelineContentType } from "@/types/timeline"
import { Metadata } from "next"

interface CharacterMetadata {
  title: string
  description: string
  backgroundImage?: string
}

interface PlotContent {
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

interface Plot {
  title: string
  structure: string
  intensity: number
  content: PlotContent
}

interface CharacterData {
  metadata: CharacterMetadata
  name: string
  description: string
  plots?: Plot[]
}

interface CharacterArcProps {
  characterData: CharacterData
}

function CharacterArc({ characterData }: CharacterArcProps) {
  const { metadata, name, description, plots } = characterData

  // Only process plots if they exist and are not empty
  const hasPlots = plots && plots.length > 0

  // Transform plots data for ArcPlot only if plots exist
  const storyPoints = hasPlots ? plots.map(plot => ({
    title: plot.title,
    structure: plot.structure,
    intensity: plot.intensity
  })) : []

  // Initialize formattedData as an empty array
  let formattedData: Array<{ title: string; content: React.ReactNode }> = []

  if (hasPlots) {
    // Prepend the Arc Plot as the first item if plots exist
    formattedData.push({
      title: `Character Arc of ${name}`,
      content: (
        <FloatingArcPlot 
          title={name}
          storyPoints={storyPoints}
        />
      ),
    })

    // Map the rest of the timeline entries
    formattedData = formattedData.concat(
      plots.map((plot) => ({
        title: plot.title,
        // Cast plot.content to the expected type for TimelineContent
        content: <TimelineContent content={plot.content as TimelineContentType} title={plot.title} />,
      }))
    )
  }

  return (
    <div className="w-full space-y-8">
      <TimelineHeader 
        title={name}
        description={description}
        backgroundImage={metadata.backgroundImage || ""}
      />
      {formattedData.length > 0 && <Timeline data={formattedData} />}
    </div>
  )
}

interface PageProps {
  params: Promise<{
    story: string
    character: string
  }>
}

export default async function CharacterPage({ params }: PageProps) {
  const { story, character } = await params

  try {
    // Try to import the story data
    const storyData = require(`@/data/story/${story}.json`)
    const characterData = storyData.character?.[character]

    // Handle case where character or character data is missing
    if (!characterData) {
      console.error(`Character "${character}" not found in story "${story}"`);
      notFound()
    }

    return <CharacterArc characterData={characterData} />
  } catch (error) {
    console.error(`Error loading data for story "${story}", character "${character}":`, error)
    // If the story file doesn't exist or other error occurs, return 404
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { story, character } = await params

  try {
    const storyData = require(`@/data/story/${story}.json`)
    const characterData = storyData.character?.[character]

    // Handle case where character or character data is missing
    if (!characterData || !characterData.metadata) {
        return {
          title: 'Character Not Found',
          description: 'The requested character data could not be found.',
        }
    }
    
    return {
      title: characterData.metadata.title,
      description: characterData.metadata.description,
      openGraph: {
        title: characterData.metadata.title,
        description: characterData.metadata.description,
        images: characterData.metadata.backgroundImage ? [characterData.metadata.backgroundImage] : [],
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for story "${story}", character "${character}":`, error)
    return {
      title: 'Character Not Found',
      description: 'The requested character could not be found.',
    }
  }
}

// Generate static paths for all available stories and their characters
export async function generateStaticParams() {
  const fs = require("fs")
  const path = require("path")
  
  const storiesDir = path.join(process.cwd(), "data", "story")
  let storyFiles: string[] = [];

  try {
    storyFiles = fs.readdirSync(storiesDir);
  } catch (error) {
    console.error("Error reading stories directory:", error);
    return []; // Return empty if directory read fails
  }

  const params = []
  
  for (const file of storyFiles) {
    if (file.endsWith(".json")) {
      const story = file.replace(".json", "")
      let storyData;
      try {
        storyData = require(`@/data/story/${story}.json`)
      } catch(e) {
        console.error(`Error reading story file ${story}.json:`, e);
        continue; // Skip this file if it cannot be read
      }
      
      // Get all character keys from the story data, ensuring character object exists
      if (storyData && storyData.character) {
        const characterKeys = Object.keys(storyData.character)
        for (const character of characterKeys) {
          // Optionally check if character data itself exists
          if (storyData.character[character]) { 
             params.push({
               story,
               character,
             })
          }
        }
      }
    }
  }
  
  return params
} 