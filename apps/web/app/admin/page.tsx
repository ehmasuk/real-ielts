import { BookOpen, FileText } from "lucide-react"
import { StatCard } from "./components/stat-card"
import { dashboardStats } from "./lib/mock-data"

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Books",
      value: dashboardStats.totalBooks,
      icon: BookOpen,
      accentColor: "indigo",
    },
    {
      title: "Total Tests",
      value: dashboardStats.totalTests,
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

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl">
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
    </div>
  )
}
