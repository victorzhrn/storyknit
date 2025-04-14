import Image from "next/image"
import type { TimelineHeaderProps } from "@/types/timeline"

export function TimelineHeader({ title, description, backgroundImage }: TimelineHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative max-w-7xl mx-auto py-32 px-4 md:px-8 lg:px-10 z-10">
        <h2 className="text-lg md:text-4xl mb-4 text-white max-w-4xl font-bold">{title}</h2>
        <p className="text-neutral-200 text-sm md:text-base max-w-2xl">{description}</p>
      </div>
    </div>
  )
}
