"use client"

import * as React from "react"
import {
  Upload,
  FileAudio,
  FileImage,
  FileVideo,
  File as FileIcon,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Copy,
  Trash2,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { getAccessToken } from "@/lib/token-manager"
import api from "@/lib/axios"

interface MediaAsset {
  _id: string
  title: string
  url: string
  publicId: string
  type: "audio" | "image" | "video" | "document"
  filename: string
  bytes: number
  used: boolean
  createdAt: string
}

function detectType(file: File): MediaAsset["type"] {
  if (file.type.startsWith("audio/")) return "audio"
  if (file.type.startsWith("image/")) return "image"
  if (file.type.startsWith("video/")) return "video"
  return "document"
}

function TypeIcon({ type, className }: { type: MediaAsset["type"]; className?: string }) {
  if (type === "audio") return <FileAudio className={className} />
  if (type === "image") return <FileImage className={className} />
  if (type === "video") return <FileVideo className={className} />
  return <FileIcon className={className} />
}

function typeBadgeColor(type: MediaAsset["type"]) {
  if (type === "audio") return "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
  if (type === "image") return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
  if (type === "video") return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
  return "bg-muted text-muted-foreground"
}

interface QueuedFile {
  file: File
  title: string
  status: "pending" | "uploading" | "done" | "error"
  error?: string
}

export default function ImportsPage() {
  const [dragActive, setDragActive] = React.useState(false)
  const [queue, setQueue] = React.useState<QueuedFile[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [library, setLibrary] = React.useState<MediaAsset[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<"all" | "audio" | "image" | "video">("all")

  const fetchLibrary = React.useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/admin/media")
      setLibrary(data)
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchLibrary()
  }, [fetchLibrary])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(Array.from(e.target.files))
      e.target.value = ""
    }
  }

  const addFiles = (files: File[]) => {
    const newQueue: QueuedFile[] = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      status: "pending" as const,
    }))
    setQueue((prev) => [...prev, ...newQueue])
  }

  const removeFile = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
  }

  const updateTitle = (index: number, title: string) => {
    setQueue((prev) => prev.map((item, i) => (i === index ? { ...item, title } : item)))
  }

  const clearQueue = () => {
    setQueue([])
  }

  const handleUpload = async () => {
    const pendingFiles = queue.filter((item) => item.status === "pending")
    if (pendingFiles.length === 0) return

    setIsUploading(true)

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      if (!item || item.status !== "pending") continue

      setQueue((prev) => prev.map((q, idx) => (idx === i ? { ...q, status: "uploading" } : q)))

      try {
        const result = await uploadToCloudinary(item.file)
        await api.post("/admin/media", {
          title: item.title.trim() || item.file.name,
          url: result.secure_url,
          publicId: result.public_id,
          type: detectType(item.file),
          filename: item.file.name,
          bytes: result.bytes,
        })
        setQueue((prev) => prev.map((q, idx) => (idx === i ? { ...q, status: "done" } : q)))
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: "error", error: err.response?.data?.message || err.message || "Upload failed" } : q,
          ),
        )
      }
    }

    await fetchLibrary()
    setIsUploading(false)
  }

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url)
    setCopiedId(asset._id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set())

  const deleteAsset = async (asset: MediaAsset) => {
    const id = asset._id
    if (!confirm(`Delete "${asset.title}"? This cannot be undone.`)) return
    if (deletingIds.has(id)) return
    setDeletingIds((prev) => new Set(prev).add(id))
    try {
      const token = getAccessToken()
      if (token) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: asset.publicId, type: asset.type }),
        })
      }
      await api.delete(`/admin/media/${id}`)
      setLibrary((prev) => prev.filter((a) => a._id !== id))
    } catch {
      // handled by interceptor
    }
    setDeletingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const toggleUsed = async (asset: MediaAsset) => {
    const id = asset._id
    try {
      await api.patch(`/admin/media/${id}`, { used: !asset.used })
      setLibrary((prev) =>
        prev.map((a) => (a._id === id ? { ...a, used: !a.used } : a)),
      )
    } catch {
      // handled by interceptor
    }
  }

  const filtered = filter === "all" ? library : library.filter((a) => a.type === filter)

  const pendingCount = queue.filter((f) => f.status === "pending").length
  const doneCount = queue.filter((f) => f.status === "done").length
  const errorCount = queue.filter((f) => f.status === "error").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Media Imports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload audio, image, and video assets to Cloudinary. Copy the secure URL to reference it in your test&apos;s{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">contentJson</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center border border-dashed rounded-2xl px-4 text-center transition-all bg-card shadow-sm",
              dragActive ? "border-indigo-500 bg-indigo-500/5" : "border-border/60 hover:border-border/80",
              queue.length > 0 ? "py-6" : "py-14"
            )}
          >
            {queue.length === 0 ? (
              <>
                <div className="flex h-14 w-14 rounded-xl bg-muted/60 items-center justify-center text-muted-foreground mb-4">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Drop media files here</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
                  Supports audio (.mp3, .wav), images (.jpg, .png, .webp), and video. You can select multiple files at once.
                </p>
                <label className="mt-5">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer text-xs">Browse files</span>
                  </Button>
                  <input
                    type="file"
                    accept="audio/*,image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between border-b border-border/20 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{queue.length} file(s) selected</h3>
                    {isUploading && (
                      <span className="text-[10px] text-muted-foreground">
                        {doneCount} uploaded, {pendingCount} remaining
                        {errorCount > 0 && `, ${errorCount} failed`}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isUploading && (
                      <label>
                        <Button variant="outline" size="sm" asChild className="text-xs">
                          <span className="cursor-pointer">Add more</span>
                        </Button>
                        <input
                          type="file"
                          accept="audio/*,image/*,video/*"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                    <Button
                      variant="ghost" size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={clearQueue}
                      disabled={isUploading}
                    >
                      Clear all
                    </Button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {queue.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-xl border transition-colors",
                        item.status === "done" && "border-emerald-500/20 bg-emerald-500/5",
                        item.status === "error" && "border-rose-500/20 bg-rose-500/5",
                        item.status === "uploading" && "border-indigo-500/20 bg-indigo-500/5",
                        item.status === "pending" && "border-border/40 bg-card",
                      )}
                    >
                      <div className="shrink-0">
                        {item.status === "done" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        {item.status === "error" && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                        {item.status === "uploading" && <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />}
                        {item.status === "pending" && <TypeIcon type={detectType(item.file)} className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {item.status === "pending" ? (
                          <input
                            className="w-full bg-transparent text-xs font-medium text-foreground outline-none"
                            value={item.title}
                            onChange={(e) => updateTitle(i, e.target.value)}
                            disabled={isUploading}
                          />
                        ) : (
                          <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          {item.file.name} • {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          {item.status === "error" && item.error && (
                            <span className="text-rose-500 ml-1">— {item.error}</span>
                          )}
                        </p>
                      </div>
                      {item.status === "pending" && !isUploading && (
                        <Button
                          variant="ghost" size="icon-sm"
                          className="h-6 w-6 text-muted-foreground hover:text-rose-500"
                          onClick={() => removeFile(i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    onClick={handleUpload}
                    size="sm"
                    disabled={isUploading || pendingCount === 0}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs hover:from-indigo-500 hover:to-purple-500"
                  >
                    {isUploading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                    {isUploading ? "Uploading..." : `Upload ${pendingCount} file(s)`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Library */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : library.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Uploaded Assets <span className="text-muted-foreground font-normal">({filtered.length})</span>
                </h3>
                <div className="flex gap-1">
                  {(["all", "audio", "image", "video"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "text-[11px] font-medium px-2.5 py-1 rounded-lg capitalize transition-colors",
                        filter === f
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                {filtered.map((asset) => {
                  const id = asset._id
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card hover:border-border/60 transition-colors"
                    >
                      <TypeIcon type={asset.type} className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground line-clamp-1">{asset.title}</span>
                          <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border", typeBadgeColor(asset.type))}>
                            {asset.type}
                          </span>
                          <span
                            className={cn(
                              "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border cursor-pointer select-none",
                              asset.used
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            )}
                            onClick={() => toggleUsed(asset)}
                            title="Toggle used status"
                          >
                            {asset.used ? "Used" : "Not Used"}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {(asset.bytes / 1024).toFixed(1)} KB • {new Date(asset.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 font-mono truncate mt-0.5 select-all" title={asset.url}>
                          {asset.url}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost" size="icon-sm"
                          onClick={() => copyUrl(asset)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                          title="Copy URL"
                        >
                          {copiedId === id
                            ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            : <Copy className="h-3.5 w-3.5" />
                          }
                        </Button>
                        <Button
                          variant="ghost" size="icon-sm"
                          onClick={() => deleteAsset(asset)}
                          disabled={deletingIds.has(id)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-rose-500 disabled:opacity-30"
                          title="Delete"
                        >
                          {deletingIds.has(id)
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No assets uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar Instructions */}
        <div className="space-y-4">
          <div className="border border-border/40 bg-card rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">How to use Media</h3>
            <ol className="text-[11px] leading-relaxed text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Upload your listening audio or passage image.</li>
              <li>Give it a descriptive title.</li>
              <li>Click <strong>Copy URL</strong> next to the asset.</li>
              <li>Paste the URL into your test&apos;s <code>contentJson</code> in the Test Editor.</li>
              <li>Toggle <strong>Used / Not Used</strong> to track which assets are in use.</li>
            </ol>
            <div className="mt-3 p-3 bg-muted/40 rounded-xl border border-border/60">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Audio Block Reference</p>
              <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all">{`{
  "type": "audio",
  "assetId": "asset_123",
  "url": "https://res.cloudinary.com/..."
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
