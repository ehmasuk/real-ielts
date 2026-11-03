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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import * as React from "react"
import type { BookItem } from "../../lib/mock-data"
import { toCategorySlug } from "@/lib/book-category"

interface TestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  books: BookItem[]
  onSave: (data: {
    bookId: string
    bookNumber: number
    bookTitle: string
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

  const bookGroups = React.useMemo(() => {
    const groups: Array<{
      label: string
      labelFor: (b: BookItem) => string
      items: BookItem[]
    }> = [
      {
        label: "Cambridge IELTS",
        labelFor: (b) => `Cambridge IELTS ${b.number}`,
        items: books
          .filter((b) => toCategorySlug(b.category) === "cambridge")
          .sort((a, b) => b.number - a.number),
      },
      {
        label: "Recent Questions",
        labelFor: (b) => b.title,
        items: books
          .filter((b) => toCategorySlug(b.category) === "recent-questions")
          .sort((a, b) => b.number - a.number),
      },
    ]
    return groups.filter((g) => g.items.length > 0)
  }, [books])

  React.useEffect(() => {
    if (open) {
      // Default select the first available book
      const first = bookGroups[0]?.items[0]
      setSelectedBookId(first ? first.id : "")
      setTestNumber("1")
      setSkill("reading")
      setErrors({})
    }
  }, [open, bookGroups])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!selectedBookId) {
      errs.book = "Please select a book"
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
      bookTitle: book.title,
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
            <Label className="text-sm font-medium">Book</Label>
            <Select value={selectedBookId} onValueChange={setSelectedBookId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Book" />
              </SelectTrigger>
              <SelectContent>
                {bookGroups.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.items.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {group.labelFor(book)}
                        {book.status !== "published" && " (draft)"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
