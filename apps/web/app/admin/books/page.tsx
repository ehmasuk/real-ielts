"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { BookOpen, Loader2, Plus } from "lucide-react"
import type { BookItem } from "../lib/mock-data"
import { BookFormDialog } from "./components/book-form-dialog"
import { BooksTable } from "./components/books-table"
import { fetchBooks, createBook, updateBook, deleteBook } from "@/lib/api"

function mapBook(b: any): BookItem {
  return {
    id: b._id,
    number: b.number,
    title: b.title,
    slug: b.slug,
    status: b.status,
    testsCount: b.testsCount || 0,
    createdAt: new Date(b.createdAt).toISOString().slice(0, 10),
    updatedAt: new Date(b.updatedAt).toISOString().slice(0, 10),
  }
}

export default function BooksPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingBook, setEditingBook] = React.useState<BookItem | null>(null)

  const { data: rawBooks, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  })

  const books: BookItem[] = rawBooks ? rawBooks.map(mapBook) : []

  const updateMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
    onError: (err) => console.error(err),
  })

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
    onError: (err) => console.error(err),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
    onError: (err) => console.error(err),
  })

  const handleEdit = (book: BookItem) => {
    setEditingBook(book)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingBook(null)
    setDialogOpen(true)
  }

  const handleToggleStatus = (book: BookItem) => {
    const newStatus = book.status === "published" ? "draft" : "published"
    updateMutation.mutate({ id: book.id, data: { status: newStatus } })
  }

  const handleDelete = (book: BookItem) => {
    if (window.confirm(`Delete "${book.title}" and all its tests? This cannot be undone.`)) {
      deleteMutation.mutate(book.id)
    }
  }

  const handleSave = (data: { number: number; title: string }) => {
    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id, data })
    } else {
      createMutation.mutate({ ...data, status: "draft" })
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
          className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Book
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            Loading books...
          </h3>
        </div>
      ) : books.length > 0 ? (
        <BooksTable
          books={books}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
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
            className="mt-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white"
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

