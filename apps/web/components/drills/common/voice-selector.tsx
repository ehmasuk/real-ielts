"use client"

import React, { useState, useEffect, useCallback } from "react"
import { ChevronDown, Globe } from "lucide-react"

const STORAGE_KEY = "drill-selected-voice"

const TARGET_VOICES = [
  { lang: "en-US", label: "American" },
  { lang: "en-GB", label: "British" },
] as const

function findVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const matches = voices.filter((v) => v.lang === lang || v.lang.startsWith(lang))
  if (matches.length === 0) return undefined
  const google = matches.find((v) => v.name.toLowerCase().includes("google"))
  return google ?? matches[0]
}

export function VoiceSelector({
  onVoiceChange,
}: {
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void
}) {
  const [options, setOptions] = useState<{ voice: SpeechSynthesisVoice; label: string }[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth) return

    const loadVoices = () => {
      const allVoices = synth.getVoices()
      const found: { voice: SpeechSynthesisVoice; label: string }[] = []

      for (const target of TARGET_VOICES) {
        const voice = findVoice(allVoices, target.lang)
        if (voice) {
          found.push({ voice, label: target.label })
        }
      }

      if (found.length === 0) return

      setOptions(found)

      const saved = localStorage.getItem(STORAGE_KEY)
      const savedIdx = found.findIndex((f) => f.voice.name === saved)
      const idx = savedIdx >= 0 ? savedIdx : 0
      setSelectedIdx(idx)
      const match = found[idx]
      if (match) onVoiceChange(match.voice)
    }

    loadVoices()
    synth.onvoiceschanged = loadVoices

    return () => {
      synth.onvoiceschanged = null
    }
  }, [onVoiceChange])

  const handleSelect = useCallback(
    (idx: number) => {
      const option = options[idx]
      if (!option) return
      setSelectedIdx(idx)
      localStorage.setItem(STORAGE_KEY, option.voice.name)
      onVoiceChange(option.voice)
      setIsOpen(false)
    },
    [options, onVoiceChange]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (options.length < 2) return null

  const selected = options[selectedIdx]

  return (
    <div ref={dropdownRef} className="relative w-full max-w-[200px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground text-xs font-medium transition-colors border border-border/30"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{selected?.label ?? "Accent"}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-card border border-border/40 shadow-xl overflow-hidden">
          {options.map((opt, idx) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-3 py-2.5 text-xs transition-colors flex items-center gap-2 ${
                idx === selectedIdx
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <span>{opt.label}</span>
              {idx === selectedIdx && (
                <span className="ml-auto text-[10px] text-primary">●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
