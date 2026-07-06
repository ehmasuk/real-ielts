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

export default function ImportsPage() {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [title, setTitle] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
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
    if (e.dataTransfer.files?.[0]) pick(e.dataTransfer.files[0])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) pick(e.target.files[0])
  }

  const pick = (file: File) => {
    setSelectedFile(file)
    setTitle(file.name.replace(/\.[^/.]+$/, ""))
    setUploadError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await uploadToCloudinary(selectedFile)
      await api.post("/admin/media", {
        title: title.trim() || selectedFile.name,
        url: result.secure_url,
        publicId: result.public_id,
        type: detectType(selectedFile),
        filename: selectedFile.name,
        bytes: result.bytes,
      })
      await fetchLibrary()
      setSelectedFile(null)
      setTitle("")
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || "Upload failed")
    } finally {
      setIsUploading(false)
    }
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

  const getFileIcon = (file: File) => {
    const t = detectType(file)
    return <TypeIcon type={t} className="h-8 w-8 text-indigo-500 shrink-0" />
  }

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
              selectedFile ? "py-8 items-start" : "py-14"
            )}
          >
            {!selectedFile ? (
              <>
                <div className="flex h-14 w-14 rounded-xl bg-muted/60 items-center justify-center text-muted-foreground mb-4">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Drop a media file here</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
                  Supports audio (.mp3, .wav), images (.jpg, .png, .webp), and video.
                </p>
                <label className="mt-5">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer text-xs">Browse files</span>
                  </Button>
                  <input
                    type="file"
                    accept="audio/*,image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 border-b border-border/20 pb-3">
                  {getFileIcon(selectedFile)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                    </p>
                  </div>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => { setSelectedFile(null); setTitle(""); setUploadError(null) }}
                    disabled={isUploading}
                  >
                    Clear
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">Title</label>
                  <input
                    className="w-full rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Listening Part 1 Audio"
                  />
                </div>

                {uploadError && (
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                    <p className="flex items-start gap-1.5 text-[11px] text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      {uploadError}
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleUpload}
                    size="sm"
                    disabled={isUploading || !title.trim()}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs hover:from-indigo-500 hover:to-purple-500"
                  >
                    {isUploading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                    {isUploading ? "Uploading..." : "Upload to Cloudinary"}
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
