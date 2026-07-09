"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Users, Loader2, Search } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { fetchUsers } from "@/lib/api"

interface User {
  _id: string
  googleId: string
  email: string
  name: string
  picture: string
  role: "student" | "admin"
  status: "active" | "disabled" | "banned"
  lastLoginAt: string
  createdAt: string
  testsAttempted: number
}

interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  student: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  disabled: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  banned: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export default function UsersPage() {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("")

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", page, search, roleFilter],
    queryFn: () =>
      fetchUsers({ page, limit: 20, search: search || undefined, role: roleFilter || undefined }),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage platform users
            {data && <span className="ml-1 text-muted-foreground/60">({data.total} total)</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 h-9 text-sm"
          />
        </div>
          <Select value={roleFilter || "all"} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(1) }}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">Loading users...</h3>
        </div>
      ) : data?.users.length ? (
        <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Tests</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Last Login</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map((user) => (
                <TableRow
                  key={user._id}
                  className="group border-border/20 hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user.picture || undefined} alt={user.name} />
                        <AvatarFallback className="text-xs font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold",
                        ROLE_COLORS[user.role] || ""
                      )}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        STATUS_COLORS[user.status] || ""
                      )}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm tabular-nums text-foreground">
                      {user.testsAttempted}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 px-4 py-3">
              <span className="text-xs text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
            <Users className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">No users found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {search ? "Try a different search term." : "No users have signed up yet."}
          </p>
        </div>
      )}
    </div>
  )
}
