"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { BookItem } from "../../lib/mock-data"

export type StaticBookCategory = "Cambridge" | "Recent Questions"

interface BookFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book?: BookItem | null
  onSave: (data: {
    number: number
    title: string
    category: StaticBookCategory
  }) => void
}

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  onSave,
}: BookFormDialogProps) {
  const isEdit = !!book
  const [number, setNumber] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState<StaticBookCategory>("Cambridge")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (open) {
      if (book) {
        setNumber(String(book.number))
        setTitle(book.title)
        setCategory(
          book.category === "Recent Questions" ? "Recent Questions" : "Cambridge"
        )
      } else {
        setNumber("")
        setTitle("")
        setCategory("Cambridge")
      }
      setErrors({})
    }
  }, [open, book])

  const validate = () => {
    const errs: Record<string, string> = {}
    const num = parseInt(number, 10)
    if (!number || isNaN(num) || num < 0) {
      errs.number = "Book number is required and must be a positive integer"
    }
    if (!title.trim()) {
      errs.title = "Title is required"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      number: parseInt(number, 10),
      title: title.trim(),
      category,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Edit Book" : "Create Book"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Update the book details and category below."
              : "Add a new IELTS book and attach a category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Book number */}
          <div className="space-y-2">
            <Label htmlFor="book-number" className="text-sm font-medium">
              Book Number
            </Label>
            <Input
              id="book-number"
              type="number"
              min={0}
              placeholder="e.g. 20"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={errors.number ? "border-destructive" : ""}
            />
            {errors.number && (
              <p className="text-[11px] text-destructive">{errors.number}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="book-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="book-title"
              placeholder="e.g. Cambridge IELTS 20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="book-category" className="text-sm font-medium">
              Book Category
            </Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as StaticBookCategory)}
            >
              <SelectTrigger id="book-category" className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cambridge">Cambridge</SelectItem>
                <SelectItem value="Recent Questions">Recent Questions</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Select which category this book belongs to.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
            >
              {isEdit ? "Save Changes" : "Create Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
