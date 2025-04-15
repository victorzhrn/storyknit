import Image from "next/image"
import Link from "next/link"
import type { TimelineHeaderProps } from "@/types/timeline"

export function TimelineHeader({ title, description, backgroundImage, tags }: TimelineHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative max-w-7xl mx-auto py-32 px-4 md:px-8 lg:px-10 z-10">
        <h2 className="text-lg md:text-4xl mb-4 text-white max-w-4xl font-bold">{title}</h2>
        <p className="text-neutral-200 text-sm md:text-base max-w-2xl mb-4">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={tag.href}
                className="inline-block bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-white/30 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
