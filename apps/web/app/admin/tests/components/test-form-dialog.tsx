"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import * as React from "react"
import type { BookItem } from "../../lib/mock-data"

interface TestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  books: BookItem[]
  onSave: (data: {
    bookId: string
    bookNumber: number
    testNumber: number
    skill: "reading" | "listening" | "writing" | "speaking"
  }) => void
}

export function TestFormDialog({
  open,
  onOpenChange,
  books,
  onSave,
}: TestFormDialogProps) {
  const [selectedBookId, setSelectedBookId] = React.useState("")
  const [testNumber, setTestNumber] = React.useState("1")
  const [skill, setSkill] = React.useState<
    "reading" | "listening" | "writing" | "speaking"
  >("reading")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (open) {
      // Default select the first published book
      const publishedBooks = books.filter((b) => b.status === "published")
      const firstPublished = publishedBooks[0]
      if (firstPublished) {
        setSelectedBookId(firstPublished.id)
      } else {
        setSelectedBookId("")
      }
      setTestNumber("1")
      setSkill("reading")
      setErrors({})
    }
  }, [open, books])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!selectedBookId) {
      errs.book = "Please select a Cambridge IELTS Book"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const book = books.find((b) => b.id === selectedBookId)
    if (!book) return

    onSave({
      bookId: selectedBookId,
      bookNumber: book.number,
      testNumber: parseInt(testNumber, 10),
      skill,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create Test</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Initialize a new IELTS practice test. You can edit content and
            answer keys on the next page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Select Book */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cambridge IELTS Book</Label>
            <Select value={selectedBookId} onValueChange={setSelectedBookId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Book" />
              </SelectTrigger>
              <SelectContent>
                {books
                  .filter((b) => b.status === "published")
                  .map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      Cambridge IELTS {book.number}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.book && (
              <p className="text-[11px] text-destructive">{errors.book}</p>
            )}
          </div>

          {/* Test Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Test Number</Label>
            <Select value={testNumber} onValueChange={setTestNumber}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Test Number" />
              </SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "4"].map((num) => (
                  <SelectItem key={num} value={num}>
                    Test {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Skill Category</Label>
            <Select
              value={skill}
              onValueChange={(val) =>
                setSkill(
                  val as "reading" | "listening" | "writing" | "speaking"
                )
              }
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select Skill" />
              </SelectTrigger>
              <SelectContent>
                {(["reading", "listening", "writing", "speaking"] as const).map(
                  (s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-2">
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
              Create and Edit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
