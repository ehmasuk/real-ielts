"use client"

import * as React from "react"

interface AudioState {
  playing: boolean
  currentTime: number
  duration: number
  muted: boolean
  volume: number
  playbackRate: number
}

interface FullTestAudioContextValue {
  audioRefs: React.RefObject<(HTMLAudioElement | null)[]>
  activePartIndex: number
  setActivePartIndex: (index: number) => void
  parts: Array<{ partNum: number; audioUrl: string; title: string }>
  state: AudioState
  togglePlay: () => void
  seekTo: (time: number) => void
  skip: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setPlaybackRate: (rate: number) => void
}

const Ctx = React.createContext<FullTestAudioContextValue | null>(null)

export function useFullTestAudio(): FullTestAudioContextValue | null {
  return React.useContext(Ctx)
}

interface FullTestAudioManagerProps {
  parts: Array<{ partNum: number; audioUrl: string; title: string }>
  showControls?: boolean
  autoAdvance?: boolean
  onAllPartsEnded?: () => void
  children: React.ReactNode
}

export function FullTestAudioManager({
  parts,
  showControls = true,
  autoAdvance = false,
  onAllPartsEnded,
  children,
}: FullTestAudioManagerProps) {
  const audioRefs = React.useRef<(HTMLAudioElement | null)[]>([])
  const [activePartIndex, setActivePartIndex] = React.useState(0)
  const [state, setState] = React.useState<AudioState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    muted: false,
    volume: 1,
    playbackRate: 1,
  })

  const activeAudio = audioRefs.current[activePartIndex]

  // Sync active audio element state
  React.useEffect(() => {
    const audio = activeAudio
    if (!audio) return

    const onTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }))
    }
    const onLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }))
    }
    const onPlay = () => setState((prev) => ({ ...prev, playing: true }))
    const onPause = () => setState((prev) => ({ ...prev, playing: false }))
    const onEnded = () => {
      setState((prev) => ({ ...prev, playing: false }))
      if (autoAdvance && activePartIndex < parts.length - 1) {
        setActivePartIndex((prev) => prev + 1)
      } else if (autoAdvance && activePartIndex === parts.length - 1) {
        onAllPartsEnded?.()
      }
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
    }
  }, [activeAudio, activePartIndex, parts.length, autoAdvance, onAllPartsEnded])

  // Pause previous audio when switching parts
  React.useEffect(() => {
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== activePartIndex && !audio.paused) {
        audio.pause()
      }
    })
  }, [activePartIndex])

  const togglePlay = React.useCallback(() => {
    const audio = activeAudio
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [activeAudio])

  const seekTo = React.useCallback(
    (time: number) => {
      const audio = activeAudio
      if (!audio) return
      audio.currentTime = time
    },
    [activeAudio]
  )

  const skip = React.useCallback(
    (seconds: number) => {
      const audio = activeAudio
      if (!audio) return
      const d = audio.duration || 0
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, d))
    },
    [activeAudio]
  )

  const setVolume = React.useCallback(
    (volume: number) => {
      const audio = activeAudio
      if (!audio) return
      audio.volume = volume
      setState((prev) => ({ ...prev, volume, muted: volume === 0 }))
    },
    [activeAudio]
  )

  const toggleMute = React.useCallback(() => {
    const audio = activeAudio
    if (!audio) return
    audio.muted = !audio.muted
    setState((prev) => ({ ...prev, muted: audio.muted }))
  }, [activeAudio])

  const setPlaybackRate = React.useCallback(
    (rate: number) => {
      const audio = activeAudio
      if (!audio) return
      audio.playbackRate = rate
      setState((prev) => ({ ...prev, playbackRate: rate }))
    },
    [activeAudio]
  )

  if (!showControls) {
    return <>{children}</>
  }

  return (
    <Ctx.Provider
      value={{
        audioRefs,
        activePartIndex,
        setActivePartIndex,
        parts,
        state,
        togglePlay,
        seekTo,
        skip,
        setVolume,
        toggleMute,
        setPlaybackRate,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
