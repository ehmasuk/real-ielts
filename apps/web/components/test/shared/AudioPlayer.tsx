"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Music,
} from "lucide-react"

interface AudioPlayerProps {
  src: string
  title?: string
}

export function AudioPlayer({ src, title = "Listening Audio" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "00:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play()
      setPlaying(true)
    } else {
      audioRef.current.pause()
      setPlaying(false)
    }
  }, [])

  useEffect(() => {
    const el = document.querySelector("[data-audio-player]")
    if (!el) return
    const handler: EventListener = (e) => {
      const event = e as KeyboardEvent
      if (
        event.code === "Space" &&
        event.target instanceof HTMLElement &&
        event.target.closest("[data-audio-player]")
      ) {
        event.preventDefault()
        togglePlay()
      }
    }
    el.addEventListener("keydown", handler)
    return () => el.removeEventListener("keydown", handler)
  }, [togglePlay])

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !progressRef.current || !duration) return
      const rect = progressRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = Math.max(0, Math.min(1, x / rect.width))
      audioRef.current.currentTime = pct * duration
    },
    [duration]
  )

  const skip = useCallback((seconds: number) => {
    if (!audioRef.current) return
    const d = audioRef.current.duration || 0
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.currentTime + seconds, d)
    )
  }, [])

  const changeVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v
      if (v === 0) setMuted(true)
      else setMuted(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = !audioRef.current.muted
    setMuted(audioRef.current.muted)
  }, [])

  const changeSpeed = useCallback((speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      setPlaybackRate(speed)
    }
    setShowSpeedMenu(false)
  }, [])

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      data-audio-player
      tabIndex={0}
      className="rounded-2xl border border-border/40 bg-card/60 p-4 md:p-5 shadow-sm"
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />

      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Music className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-bold text-foreground">{title}</span>
      </div>

      <div
        ref={progressRef}
        className="group relative mb-3 h-2 cursor-pointer rounded-full bg-muted"
        onClick={handleProgressClick}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-indigo-500 bg-white shadow-sm transition-all duration-75 opacity-0 group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 7px)` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => skip(-10)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            title="-10 seconds"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-md active:scale-95 transition-all"
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            title="+10 seconds"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : volume < 0.5 ? (
              <Volume1 className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            className="h-1 w-16 cursor-pointer accent-indigo-500"
          />

          <div className="relative ml-1">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-[11px] font-bold text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSpeedMenu(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-14 rounded-xl border border-border/40 bg-card p-1 shadow-lg">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`w-full rounded-lg px-1.5 py-1 text-[11px] font-bold transition-colors ${
                        playbackRate === s
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
