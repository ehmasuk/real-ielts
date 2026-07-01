"use client"

import * as React from "react"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Archive,
  RotateCcw,
  FileText,
  ArrowUpDown,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import type { BookItem } from "../../lib/mock-data"

interface BooksTableProps {
  books: BookItem[]
  onEdit: (book: BookItem) => void
  onToggleStatus: (book: BookItem) => void
  onDelete: (book: BookItem) => void
}

type SortField = "number" | "title" | "status" | "testsCount"
type SortDir = "asc" | "desc"

export function BooksTable({ books, onEdit, onToggleStatus, onDelete }: BooksTableProps) {
  const [sortField, setSortField] = React.useState<SortField>("number")
  const [sortDir, setSortDir] = React.useState<SortDir>("desc")

  const sorted = React.useMemo(() => {
    return [...books].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [books, sortField, sortDir])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => (
    <TableHead>
      <button
        onClick={() => toggleSort(field)}
        className="inline-flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
      >
        {children}
        <ArrowUpDown
          className={cn(
            "h-3 w-3 transition-colors",
            sortField === field
              ? "text-indigo-500"
              : "text-muted-foreground/30"
          )}
        />
      </button>
    </TableHead>
  )

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/40">
            <SortableHeader field="number">#</SortableHeader>
            <SortableHeader field="title">Title</SortableHeader>
            <TableHead className="hidden sm:table-cell">Slug</TableHead>
            <SortableHeader field="status">Status</SortableHeader>
            <SortableHeader field="testsCount">Tests</SortableHeader>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((book) => (
            <TableRow
              key={book.id}
              className="group border-border/20 hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-bold text-foreground tabular-nums">
                {book.number}
              </TableCell>
              <TableCell>
                <span className="font-medium text-foreground">
                  {book.title}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <code className="rounded bg-muted/60 px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                  {book.slug}
                </code>
              </TableCell>
              <TableCell>
                <Badge
                  variant={book.status === "published" ? "default" : "secondary"}
                  className={cn(
                    "text-[10px] font-semibold",
                    book.status === "published"
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border/40"
                  )}
                >
                  {book.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="text-sm tabular-nums">{book.testsCount}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                {book.updatedAt}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(book)}>
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onToggleStatus(book)}
                    >
                      {book.status === "published" ? (
                        <>
                          <Archive className="mr-2 h-3.5 w-3.5" />
                          Move to Draft
                        </>
                      ) : (
                        <>
                          <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(book)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
