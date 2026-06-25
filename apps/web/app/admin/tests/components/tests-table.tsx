"use client"

import * as React from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
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
import type { TestItem } from "../../lib/mock-data"

interface TestsTableProps {
  tests: TestItem[]
  onTogglePublish: (test: TestItem) => void
  onDelete: (test: TestItem) => void
}

export function TestsTable({ tests, onTogglePublish, onDelete }: TestsTableProps) {
  const getSkillColor = (skill: string) => {
    switch (skill) {
      case "listening":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
      case "reading":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      case "writing":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "speaking":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
      default:
        return "bg-muted text-muted-foreground border-border/40"
    }
  }

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead>Test Details</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Skill</TableHead>
            <TableHead className="hidden sm:table-cell">Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow
              key={test.id}
              className="group border-border/20 hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-semibold text-foreground">
                <div className="flex flex-col">
                  <span>Test {test.testNumber}</span>
                  <span className="text-[10px] text-muted-foreground font-normal sm:hidden">
                    C{test.bookNumber} • {test.skill}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                Cambridge {test.bookNumber}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-semibold capitalize", getSkillColor(test.skill))}
                >
                  {test.skill}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <code className="rounded bg-muted/60 px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{test.version}
                </code>
              </TableCell>
              <TableCell>
                <Badge
                  variant={test.status === "published" ? "default" : "secondary"}
                  className={cn(
                    "text-[10px] font-semibold capitalize",
                    test.status === "published"
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border/40"
                  )}
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                {test.updatedAt}
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
                  <DropdownMenuContent align="end" className="w-44">
                    <Link href={`/admin/tests/${test.id}/edit`} passHref legacyBehavior>
                      <DropdownMenuItem asChild>
                        <a className="flex items-center w-full">
                          <Edit className="mr-2 h-3.5 w-3.5" />
                          Edit Content & QA
                        </a>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => onTogglePublish(test)}>
                      {test.status === "published" ? (
                        <>
                          <XCircle className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          Unpublish (Draft)
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(test)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
