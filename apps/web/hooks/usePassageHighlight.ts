"use client"

import { useCallback, useEffect, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type HighlightColor = "yellow" | "green" | "blue" | "pink"

export interface StoredHighlight {
  id: string
  color: HighlightColor
  /** child-index path from containerRef root → startContainer text node */
  startPath: number[]
  startOffset: number
  /** child-index path from containerRef root → endContainer text node */
  endPath: number[]
  endOffset: number
}

export interface ContextMenuState {
  x: number
  y: number
  /** "selection" = user right-clicked on selected text  */
  mode: "selection"
  pendingRange: Range
}

export interface OnHighlightMenuState {
  x: number
  y: number
  /** "on-highlight" = user right-clicked on already-highlighted text */
  mode: "on-highlight"
  targetId: string
}

export type MenuState = ContextMenuState | OnHighlightMenuState | null

// ─── CSS highlight names ──────────────────────────────────────────────────────

export const COLOR_CSS: Record<HighlightColor, string> = {
  yellow: "hl-yellow",
  green:  "hl-green",
  blue:   "hl-blue",
  pink:   "hl-pink",
}

// ─── Serialisation helpers ────────────────────────────────────────────────────

function getNodeByPath(root: Node, path: number[]): Node | null {
  let node: Node = root
  for (const idx of path) {
    if (!node.childNodes[idx]) return null
    node = node.childNodes[idx]
  }
  return node
}

function getPathToNode(root: Node, target: Node): number[] | null {
  if (root === target) return []
  for (let i = 0; i < root.childNodes.length; i++) {
    const sub = getPathToNode(root.childNodes[i]!, target)
    if (sub !== null) return [i, ...sub]
  }
  return null
}

export function serializeRange(
  container: Node,
  range: Range,
): Omit<StoredHighlight, "id" | "color"> | null {
  const startPath = getPathToNode(container, range.startContainer)
  const endPath   = getPathToNode(container, range.endContainer)
  if (!startPath || !endPath) return null
  return { startPath, startOffset: range.startOffset, endPath, endOffset: range.endOffset }
}

export function deserializeRange(container: Node, hl: StoredHighlight): Range | null {
  try {
    const startNode = getNodeByPath(container, hl.startPath)
    const endNode   = getNodeByPath(container, hl.endPath)
    if (!startNode || !endNode) return null
    const range = new Range()
    range.setStart(startNode, hl.startOffset)
    range.setEnd(endNode, hl.endOffset)
    return range
  } catch {
    return null
  }
}

/** Returns the stored highlight whose range contains the given (x, y) viewport point. */
function findHighlightAtPoint(
  x: number,
  y: number,
  container: Node,
  highlights: StoredHighlight[],
): StoredHighlight | null {
  // Resolve the DOM text position at the click point
  let clickRange: Range | null = null
  if (typeof document.caretRangeFromPoint === "function") {
    clickRange = document.caretRangeFromPoint(x, y)
  } else if (typeof (document as any).caretPositionFromPoint === "function") {
    const pos = (document as any).caretPositionFromPoint(x, y)
    if (pos) {
      clickRange = document.createRange()
      clickRange.setStart(pos.offsetNode, pos.offset)
    }
  }
  if (!clickRange) return null

  for (const hl of highlights) {
    const range = deserializeRange(container, hl)
    if (!range) continue
    if (range.isPointInRange(clickRange.startContainer, clickRange.startOffset)) {
      return hl
    }
  }
  return null
}

// ─── Inject ::highlight() CSS rules once (Turbopack strips them from .css files) ──

function injectHighlightStyles() {
  if (typeof document === "undefined") return
  if (document.getElementById("__hl_styles")) return
  const s = document.createElement("style")
  s.id = "__hl_styles"
  s.textContent = [
    "::highlight(hl-yellow){background-color:rgba(253,224,71,.55);color:inherit}",
    "::highlight(hl-green){background-color:rgba(134,239,172,.55);color:inherit}",
    "::highlight(hl-blue){background-color:rgba(147,197,253,.55);color:inherit}",
    "::highlight(hl-pink){background-color:rgba(249,168,212,.55);color:inherit}",
    ".dark ::highlight(hl-yellow){background-color:rgba(253,224,71,.30)}",
    ".dark ::highlight(hl-green){background-color:rgba(134,239,172,.30)}",
    ".dark ::highlight(hl-blue){background-color:rgba(147,197,253,.30)}",
    ".dark ::highlight(hl-pink){background-color:rgba(249,168,212,.30)}",
  ].join("")
  document.head.appendChild(s)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Provides right-click–based text highlighting via the CSS Custom Highlight API.
 * - Right-click on selected text  → context menu with "Highlight" option
 * - Right-click on highlighted text → context menu with "Clear highlight" option
 * - Native browser context menu is suppressed inside the container
 *
 * IMPORTANT: Attach `containerRef` to a DOM node whose children NEVER change
 * conditionally (no conditional JSX siblings inside it). The serialised paths
 * depend on a stable child-index structure.
 */
export function useHighlight(containerRef: React.RefObject<HTMLElement | null>) {
  const [highlights, setHighlights] = useState<StoredHighlight[]>([])
  const [menu, setMenu] = useState<MenuState>(null)

  // Inject CSS highlight pseudo-element rules
  useEffect(injectHighlightStyles, [])

  // Sync highlights → CSS.highlights API
  useEffect(() => {
    if (typeof CSS === "undefined" || !("highlights" in CSS)) return
    const container = containerRef.current
    if (!container) return

    // Wipe & rebuild from state
    for (const name of Object.values(COLOR_CSS)) CSS.highlights.delete(name)

    const byColor: Partial<Record<HighlightColor, Range[]>> = {}
    for (const hl of highlights) {
      const range = deserializeRange(container, hl)
      if (!range) continue
      ;(byColor[hl.color] ??= []).push(range)
    }

    for (const [color, ranges] of Object.entries(byColor) as [HighlightColor, Range[]][]) {
      CSS.highlights.set(COLOR_CSS[color], new (window as any).Highlight(...ranges))
    }
  }, [highlights, containerRef])

  // contextmenu listener — suppress native menu and show ours
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onContextMenu = (e: MouseEvent) => {
      // Always suppress the browser's native context menu inside the container
      e.preventDefault()

      const container = containerRef.current
      if (!container) return

      const { clientX: x, clientY: y } = e

      // Priority 1: text is currently selected → offer "Highlight"
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        if (container.contains(range.commonAncestorContainer)) {
          setMenu({ mode: "selection", x, y, pendingRange: range.cloneRange() })
          return
        }
      }

      // Priority 2: right-clicked on existing highlight → offer "Clear highlight"
      const found = findHighlightAtPoint(x, y, container, highlights)
      if (found) {
        setMenu({ mode: "on-highlight", x, y, targetId: found.id })
        return
      }

      // Otherwise close any open menu
      setMenu(null)
    }

    container.addEventListener("contextmenu", onContextMenu)
    return () => container.removeEventListener("contextmenu", onContextMenu)
    // highlights must be in deps so the closure always has the latest list
  }, [containerRef, highlights])

  // Close menu on click anywhere outside the menu itself
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-hl-menu]")) {
        setMenu(null)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  // ── Actions ──────────────────────────────────────────────────────────────────

  const applyHighlight = useCallback(
    (color: HighlightColor) => {
      if (!menu || menu.mode !== "selection") return
      const container = containerRef.current
      if (!container) return
      const serialized = serializeRange(container, menu.pendingRange)
      if (!serialized) return
      setHighlights(prev => [...prev, { id: crypto.randomUUID(), color, ...serialized }])
      window.getSelection()?.removeAllRanges()
      setMenu(null)
    },
    [containerRef, menu],
  )

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id))
    setMenu(null)
  }, [])

  const clearAll = useCallback(() => {
    setHighlights([])
    setMenu(null)
    if (typeof CSS !== "undefined" && "highlights" in CSS) {
      for (const name of Object.values(COLOR_CSS)) CSS.highlights.delete(name)
    }
  }, [])

  return { highlights, menu, applyHighlight, removeHighlight, clearAll }
}
