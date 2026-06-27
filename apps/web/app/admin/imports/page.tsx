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

interface MediaAsset {
  id: string
  type: "audio" | "image" | "video" | "document"
  url: string
  filename: string
  bytes: number
  uploadedAt: string
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

const STORAGE_KEY = "media_library"

export default function ImportsPage() {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [library, setLibrary] = React.useState<MediaAsset[]>([])
  const [filter, setFilter] = React.useState<"all" | "audio" | "image" | "video">("all")

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setLibrary(JSON.parse(stored))
    } catch {}
  }, [])

  const persist = (items: MediaAsset[]) => {
    setLibrary(items)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }

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
    setUploadError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await uploadToCloudinary(selectedFile)
      const asset: MediaAsset = {
        id: result.public_id,
        type: detectType(selectedFile),
        url: result.secure_url,
        filename: selectedFile.name,
        bytes: result.bytes,
        uploadedAt: new Date().toLocaleString(),
      }
      persist([asset, ...library])
      setSelectedFile(null)
    } catch (err: any) {
      setUploadError(err.message || "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url)
    setCopiedId(asset.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteAsset = (id: string) => {
    persist(library.filter((a) => a.id !== id))
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
                    onClick={() => { setSelectedFile(null); setUploadError(null) }}
                    disabled={isUploading}
                  >
                    Clear
                  </Button>
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
                    disabled={isUploading}
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
          {library.length > 0 && (
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
                {filtered.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card hover:border-border/60 transition-colors"
                  >
                    <TypeIcon type={asset.type} className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground truncate max-w-[200px]">{asset.filename}</span>
                        <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border", typeBadgeColor(asset.type))}>
                          {asset.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {(asset.bytes / 1024).toFixed(1)} KB • {asset.uploadedAt}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost" size="icon-sm"
                        onClick={() => copyUrl(asset)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                        title="Copy URL"
                      >
                        {copiedId === asset.id
                          ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          : <Copy className="h-3.5 w-3.5" />
                        }
                      </Button>
                      <Button
                        variant="ghost" size="icon-sm"
                        onClick={() => deleteAsset(asset.id)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-rose-500"
                        title="Remove from library"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Instructions */}
        <div className="space-y-4">
          <div className="border border-border/40 bg-card rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">How to use Media</h3>
            <ol className="text-[11px] leading-relaxed text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Upload your listening audio or passage image.</li>
              <li>Click <strong>Copy URL</strong> next to the asset.</li>
              <li>Paste the URL into your test&apos;s <code>contentJson</code> in the Test Editor.</li>
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
