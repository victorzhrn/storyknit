"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { TimelineContent as TimelineContentType } from "@/types/timeline"

interface TimelineContentProps {
  content: TimelineContentType
  title: string
}

export function TimelineContent({ content, title }: TimelineContentProps) {
  const { mainText, characterDevelopment, image } = content
  const pathname = usePathname()

  return (
    <div data-plot-title={title}>
      <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">{mainText}</p>

      {characterDevelopment && characterDevelopment.map((dev, index) => (
        <div key={index} className="mb-4 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3">
          <p className="text-neutral-600 dark:text-neutral-400 text-xs italic">
            <Link 
              href={`${pathname}/${dev.character}`}
              className="font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {dev.name}：
            </Link>{" "}
            {dev.text}
          </p>
        </div>
      ))}

      <div className="mb-4">
        <Image
          src={image?.src || "/placeholder.svg"}
          alt={image?.alt || "Scene illustration"}
          width={800}
          height={500}
          className="rounded-lg object-cover h-40 md:h-60 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
        />
      </div>
    </div>
  )
}
