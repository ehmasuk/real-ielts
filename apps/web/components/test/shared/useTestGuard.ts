"use client"

import { useEffect, useCallback, useState, useRef } from "react"

export function useTestGuard() {
  const [showModal, setShowModal] = useState(false)
  const [leaveType, setLeaveType] = useState<"link" | "back" | null>(null)
  const pendingUrlRef = useRef<string | null>(null)
  const guardActiveRef = useRef(true)
  const beforeUnloadHandlerRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null)

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    beforeUnloadHandlerRef.current = handler
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])

  useEffect(() => {
    const popStateHandler = () => {
      if (!guardActiveRef.current) return
      window.history.forward()
      setLeaveType("back")
      setShowModal(true)
    }
    window.addEventListener("popstate", popStateHandler)
    return () => window.removeEventListener("popstate", popStateHandler)
  }, [])

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return
      if (anchor.getAttribute("target") === "_blank") return
      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return

      const currentPath = window.location.pathname
      const targetPath = new URL(href, window.location.origin).pathname

      if (targetPath === currentPath) return

      e.preventDefault()
      pendingUrlRef.current = href
      setLeaveType("link")
      setShowModal(true)
    }

    document.addEventListener("click", clickHandler, true)
    return () => document.removeEventListener("click", clickHandler, true)
  }, [])

  const confirmLeave = useCallback(() => {
    guardActiveRef.current = false

    if (beforeUnloadHandlerRef.current) {
      window.removeEventListener("beforeunload", beforeUnloadHandlerRef.current)
    }

    setShowModal(false)

    if (leaveType === "back") {
      window.history.back()
    } else if (leaveType === "link" && pendingUrlRef.current) {
      const href = pendingUrlRef.current
      pendingUrlRef.current = null
      if (href.startsWith("/")) {
        window.location.href = href
      } else {
        window.location.href = new URL(href, window.location.origin).href
      }
    }
  }, [leaveType])

  const cancelLeave = useCallback(() => {
    pendingUrlRef.current = null
    setLeaveType(null)
    setShowModal(false)
  }, [])

  const bypassOnce = useCallback(() => {
    guardActiveRef.current = false
    if (beforeUnloadHandlerRef.current) {
      window.removeEventListener("beforeunload", beforeUnloadHandlerRef.current)
    }
  }, [])

  return { showModal, confirmLeave, cancelLeave, bypassOnce }
}
