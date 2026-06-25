"use client"

import * as React from "react"
import { Plus, BookOpen } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { booksData, type BookItem } from "../lib/mock-data"
import { BooksTable } from "./components/books-table"
import { BookFormDialog } from "./components/book-form-dialog"

export default function BooksPage() {
  const [books, setBooks] = React.useState<BookItem[]>(booksData)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingBook, setEditingBook] = React.useState<BookItem | null>(null)

  const handleEdit = (book: BookItem) => {
    setEditingBook(book)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingBook(null)
    setDialogOpen(true)
  }

  const handleToggleArchive = (book: BookItem) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? {
              ...b,
              status: b.status === "active" ? ("archived" as const) : ("active" as const),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : b
      )
    )
  }

  const handleSave = (data: {
    number: number
    title: string
  }) => {
    const generatedSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    if (editingBook) {
      // Update existing
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editingBook.id
            ? {
                ...b,
                ...data,
                slug: generatedSlug,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : b
        )
      )
    } else {
      // Create new
      const newBook: BookItem = {
        id: `b${Date.now()}`,
        ...data,
        slug: generatedSlug,
        status: "active",
        testsCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      }
      setBooks((prev) => [newBook, ...prev])
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Books
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage Cambridge IELTS books on the platform
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Book
        </Button>
      </div>

      {/* Table */}
      {books.length > 0 ? (
        <BooksTable
          books={books}
          onEdit={handleEdit}
          onToggleArchive={handleToggleArchive}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
            <BookOpen className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No books found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Get started by creating your first book.
          </p>
          <Button
            onClick={handleCreate}
            size="sm"
            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create Book
          </Button>
        </div>
      )}

      {/* Dialog */}
      <BookFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={editingBook}
        onSave={handleSave}
      />
    </div>
  )
}
