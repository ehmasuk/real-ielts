"use client"

import * as React from "react"
import { Highlighter, X } from "lucide-react"
import type { MenuState, HighlightColor } from "@/hooks/usePassageHighlight"

interface Props {
  menu: MenuState
  onApply: (color: HighlightColor) => void
  onClear: (id: string) => void
}

const COLORS: { color: HighlightColor; label: string; tw: string }[] = [
  { color: "yellow", label: "Yellow", tw: "bg-yellow-300 hover:bg-yellow-400" },
  { color: "green",  label: "Green",  tw: "bg-green-300  hover:bg-green-400"  },
  { color: "blue",   label: "Blue",   tw: "bg-blue-300   hover:bg-blue-400"   },
  { color: "pink",   label: "Pink",   tw: "bg-pink-300   hover:bg-pink-400"   },
]

/**
 * Right-click context menu for the highlight feature.
 * - "selection" mode: shows colour swatches so the user can pick a highlight colour
 * - "on-highlight" mode: shows a "Clear highlight" option
 *
 * Uses `position:fixed` so it renders at the exact mouse coordinates regardless
 * of scroll position, and `data-hl-menu` so the outside-click handler can skip it.
 */
export function HighlightContextMenu({ menu, onApply, onClear }: Props) {
  if (!menu) return null

  return (
    <div
      data-hl-menu
      style={{
        position: "fixed",
        left: menu.x,
        top: menu.y,
        zIndex: 9999,
        minWidth: "10rem",
      }}
      className="overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-xl animate-in fade-in zoom-in-95 duration-150"
    >
      {menu.mode === "selection" && (
        <>
          {/* Section label */}
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Highlight
          </div>

          {/* Colour row */}
          <div className="flex items-center gap-2 px-3 pb-2">
            {COLORS.map(({ color, label, tw }) => (
              <button
                key={color}
                title={label}
                onMouseDown={(e) => {
                  e.preventDefault()   // keep browser selection alive
                  onApply(color)
                }}
                className={`h-6 w-6 rounded-full ${tw} transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1`}
              />
            ))}
          </div>
        </>
      )}

      {menu.mode === "on-highlight" && (
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            onClear(menu.targetId)
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
          Clear highlight
        </button>
      )}
    </div>
  )
}
