import * as React from "react"
import { BookOpen } from "lucide-react"
import { formatString } from "./formatString"

export interface ReadingPassageSectionBlock {
  type: "paragraph" | "heading" | string
  text: string
}

export interface ReadingPassageSection {
  id?: string
  label?: string
  blocks?: ReadingPassageSectionBlock[]
}

export interface ReadingPassageData {
  title?: string
  subtitle?: string
  glossary?: string[]
  sections?: ReadingPassageSection[]
  blocks?: ReadingPassageSectionBlock[]
  text?: string
}

interface ReadingPassageViewProps {
  passage?: ReadingPassageData | string | null
  fallbackTitle?: string
}

export function ReadingPassageView({ passage, fallbackTitle }: ReadingPassageViewProps) {
  if (!passage) {
    return (
      <div className="py-12 text-center text-zinc-500 font-mono text-xs">
        No reading passage text available for this section.
      </div>
    )
  }

  // Handle plain string passage
  if (typeof passage === "string") {
    const paragraphs = passage.split(/\n\s*\n/).filter(Boolean)
    return (
      <div className="space-y-4 text-sm sm:text-base leading-7 text-zinc-800 dark:text-zinc-200">
        <h2
          className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {fallbackTitle || "Reading Passage Text"}
        </h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-justify leading-7">
            {formatString(p)}
          </p>
        ))}
      </div>
    )
  }

  const title = passage.title || fallbackTitle || "Reading Passage"
  const subtitle = passage.subtitle?.trim()
  const hasSections = Array.isArray(passage.sections) && passage.sections.length > 0
  const hasBlocks = Array.isArray(passage.blocks) && passage.blocks.length > 0
  const hasGlossary = Array.isArray(passage.glossary) && passage.glossary.length > 0

  return (
    <div className="space-y-6">
      {/* Passage Title & Subtitle */}
      <div>
        <h2
          className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm italic text-zinc-600 dark:text-zinc-400 mt-2 border-l-2 border-red-500/60 pl-3 leading-relaxed">
            {formatString(subtitle)}
          </p>
        )}
      </div>

      {/* Structured Sections (A, B, C...) */}
      {hasSections && (
        <div className="space-y-6">
          {passage.sections!.map((section, sIdx) => {
            const label = section.label?.trim()
            return (
              <div key={section.id || sIdx} className="space-y-3">
                {label && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                      Section {label}
                    </span>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                )}
                {Array.isArray(section.blocks) &&
                  section.blocks.map((block, bIdx) => {
                    if (block.type === "heading") {
                      return (
                        <h3
                          key={bIdx}
                          className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 pt-2"
                        >
                          {formatString(block.text)}
                        </h3>
                      )
                    }
                    return (
                      <p
                        key={bIdx}
                        className="text-sm sm:text-base leading-7 text-zinc-800 dark:text-zinc-200 text-justify"
                      >
                        {formatString(block.text)}
                      </p>
                    )
                  })}
              </div>
            )
          })}
        </div>
      )}

      {/* Top-Level Blocks (fallback if no sections) */}
      {!hasSections && hasBlocks && (
        <div className="space-y-4">
          {passage.blocks!.map((block, bIdx) => {
            if (block.type === "heading") {
              return (
                <h3
                  key={bIdx}
                  className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 pt-2"
                >
                  {formatString(block.text)}
                </h3>
              )
            }
            return (
              <p
                key={bIdx}
                className="text-sm sm:text-base leading-7 text-zinc-800 dark:text-zinc-200 text-justify"
              >
                {formatString(block.text)}
              </p>
            )
          })}
        </div>
      )}

      {/* Fallback to plain text if neither sections nor blocks exist */}
      {!hasSections && !hasBlocks && passage.text && (
        <div className="space-y-4 text-sm sm:text-base leading-7 text-zinc-800 dark:text-zinc-200">
          {passage.text.split(/\n\s*\n/).filter(Boolean).map((p, i) => (
            <p key={i} className="text-justify leading-7">
              {formatString(p)}
            </p>
          ))}
        </div>
      )}

      {/* Glossary & Footnotes */}
      {hasGlossary && (
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Glossary & Notes
            </span>
          </div>
          <div className="space-y-1.5 font-sans text-xs text-zinc-600 dark:text-zinc-400">
            {passage.glossary!.map((item, gIdx) => (
              <p key={gIdx} className="leading-relaxed">
                {formatString(item)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
