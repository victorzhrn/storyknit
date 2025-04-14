export interface CharacterDevelopment {
  character: string
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
}

export interface MovieTimelineProps {
  headerProps: TimelineHeaderProps
  timelineData: TimelineEntry[]
}
