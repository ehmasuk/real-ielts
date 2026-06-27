"use client"

import { BookOpen, FileText, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { StatCard } from "./components/stat-card"
import { fetchBooks, fetchTests } from "@/lib/api"

export default function AdminDashboardPage() {
  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  })

  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
  })

  const isLoading = booksLoading || testsLoading

  const stats = [
    {
      title: "Total Books",
      value: books?.length ?? 0,
      icon: BookOpen,
      accentColor: "indigo",
    },
    {
      title: "Total Tests",
      value: tests?.length ?? 0,
      icon: FileText,
      accentColor: "purple",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your IELTS content platform
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-32 max-w-2xl items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
        </div>
      ) : (
        <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              accentColor={stat.accentColor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

