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
import { Input } from "@workspace/ui/components/input"
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
import type { BookItem, TestItem } from "../../lib/mock-data"
import { toCategorySlug } from "@/lib/book-category"

interface TestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  books: BookItem[]
  tests: TestItem[]
  /** When provided, the book is implied (e.g. invoked from a book detail page) and not selectable. */
  lockedBook?: BookItem | null
  /** When provided, the skill is fixed and not selectable. */
  lockedSkill?: "reading" | "listening" | "writing" | "speaking" | null
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
  tests,
  lockedBook,
  lockedSkill,
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

  // Tests are unlimited per book, so suggest the next free number
  // for the active book (numbers are shared across all skills).
  const activeBookId = lockedBook ? lockedBook.id : selectedBookId
  const nextTestNumber = React.useMemo(() => {
    let max = 0
    for (const t of tests) {
      if (t.bookId === activeBookId && t.testNumber > max) {
        max = t.testNumber
      }
    }
    return max + 1
  }, [tests, activeBookId])

  React.useEffect(() => {
    if (open) {
      if (lockedBook || lockedSkill) {
        setSelectedBookId(lockedBook ? lockedBook.id : "")
        setSkill(lockedSkill ?? "reading")
      } else {
        // Default select the first available book
        const first = bookGroups[0]?.items[0]
        setSelectedBookId(first ? first.id : "")
        setSkill("reading")
      }
      setErrors({})
    }
  }, [open, bookGroups, lockedBook, lockedSkill])

  // Prefill / re-suggest the next available number when the dialog
  // opens or the selected book changes.
  React.useEffect(() => {
    if (open) setTestNumber(String(nextTestNumber))
  }, [open, nextTestNumber])

  const validate = () => {
    const errs: Record<string, string> = {}
    const parsed = parseInt(testNumber, 10)
    if (!selectedBookId) {
      errs.book = "Please select a book"
    }
    if (!testNumber || !Number.isInteger(parsed) || parsed < 1) {
      errs.testNumber = "Test number must be a positive whole number"
    } else if (
      tests.some(
        (t) =>
          t.bookId === activeBookId &&
          t.testNumber === parsed &&
          t.skill === skill
      )
    ) {
      errs.testNumber = `Test ${parsed} (${skill}) already exists in this book`
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const book = lockedBook ?? books.find((b) => b.id === selectedBookId)
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
            {lockedBook ? (
              <div className="rounded-md border border-border/40 bg-muted/30 px-3 py-2 text-sm text-foreground">
                {lockedBook.title}
              </div>
            ) : (
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
            )}
            {errors.book && (
              <p className="text-[11px] text-destructive">{errors.book}</p>
            )}
          </div>

          {/* Test Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Test Number</Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="Enter test number"
            />
            <p className="text-[11px] text-muted-foreground">
              Next available for this book: {nextTestNumber}
            </p>
            {errors.testNumber && (
              <p className="text-[11px] text-destructive">{errors.testNumber}</p>
            )}
          </div>

          {/* Skill */}
          {lockedSkill ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill Category</Label>
              <div className="rounded-md border border-border/40 bg-muted/30 px-3 py-2 text-sm capitalize text-foreground">
                {lockedSkill}
              </div>
            </div>
          ) : (
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
          )}

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
