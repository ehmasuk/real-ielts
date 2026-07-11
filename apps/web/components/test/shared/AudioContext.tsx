"use client"

import * as React from "react"

export interface AudioContextValue {
  audioRef: React.RefObject<HTMLAudioElement | null>
  currentTime: number
  playing: boolean
  seekTo: (time: number) => void
  playSegment: (start: number, end: number) => void
}

const Ctx = React.createContext<AudioContextValue | null>(null)

export function useAudio(): AudioContextValue | null {
  return React.useContext(Ctx)
}

export function AudioProvider({
  src,
  children,
}: {
  src?: string | null
  children: React.ReactNode
}) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const segmentEndRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      const time = audio.currentTime
      setCurrentTime(time)
      if (segmentEndRef.current !== null && time >= segmentEndRef.current) {
        audio.pause()
        segmentEndRef.current = null
      }
    }

    const onPlay = () => setPlaying(true)
    const onPause = () => {
      setPlaying(false)
      segmentEndRef.current = null
    }
    const onEnded = () => {
      setPlaying(false)
      segmentEndRef.current = null
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
    }
  }, [src])

  const seekTo = React.useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    segmentEndRef.current = null
    audio.currentTime = time
  }, [])

  const playSegment = React.useCallback((start: number, end: number) => {
    const audio = audioRef.current
    if (!audio) return
    segmentEndRef.current = end
    audio.currentTime = start
    audio.play().catch(() => {})
  }, [])

  return (
    <Ctx.Provider value={{ audioRef, currentTime, playing, seekTo, playSegment }}>
      {src && <audio ref={audioRef} src={src} preload="metadata" className="hidden" />}
      {children}
    </Ctx.Provider>
  )
}
