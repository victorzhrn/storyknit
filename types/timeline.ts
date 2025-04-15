export interface CharacterDevelopment {
  character: string
  name: string
  text: string
}

export interface TimelineContent {
  mainText: string
  characterDevelopment: CharacterDevelopment[]
  image: {
    src: string
    alt: string
  }
}

export interface TimelineEntry {
  title: string
  content: TimelineContent
}

export interface TimelineHeaderProps {
  title: string
  description: string
  backgroundImage: string
  /** Optional array of tags (e.g., character links) to display in the header */
  tags?: { name: string; href: string }[]
}

export interface MovieTimelineProps {
  headerProps: TimelineHeaderProps
  timelineData: TimelineEntry[]
}
