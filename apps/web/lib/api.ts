/**
 * Shared API query/mutation functions used with TanStack Query.
 * All functions use the centralized Axios client from lib/axios.ts,
 * so authentication headers added there will apply here automatically.
 *
 * Return types mirror the backend API shapes so callers are typed and
 * self-documenting.
 */
import api from "@/lib/axios"
import type {
  Book,
  TestItem,
  TestPart,
  PartResult,
  UserPartResult,
  FullTestResult,
  FullTestSubmitResponse,
  UserFullTestResult,
  DrillManifest,
  BugReport,
  User,
  UsersResponse,
  PaginationParams,
} from "@/lib/types"

// ─── Public ───────────────────────────────────────────────────────────────────

export const fetchPublicBooks = async (): Promise<Book[]> => {
  const res = await api.get<Book[]>("/books")
  return res.data
}

export const fetchBookCount = async (): Promise<{ count: number }> => {
  const res = await api.get<{ count: number }>("/books/count")
  return res.data
}

export const fetchPublicTests = async (params?: { bookId?: string; skill?: string }): Promise<TestItem[]> => {
  const res = await api.get<TestItem[]>("/tests", { params })
  return res.data
}

export const fetchPublicTestsList = async (params?: { bookId?: string; skill?: string }): Promise<TestItem[]> => {
  const res = await api.get<TestItem[]>("/tests/list", { params })
  return res.data
}

export const fetchPublicTest = async (testId: string): Promise<TestItem> => {
  const res = await api.get<TestItem>(`/tests/${testId}`)
  return res.data
}

export const fetchPublicTestPart = async (testId: string, partNum: number): Promise<TestPart> => {
  const res = await api.get<TestPart>(`/tests/${testId}/part/${partNum}`)
  return res.data
}

export const submitTestPart = async (
  testId: string,
  partNum: number,
  answers: Record<string, any>,
  timeTaken?: number
): Promise<PartResult> => {
  const res = await api.post<PartResult>(`/tests/${testId}/part/${partNum}/submit`, { answers, timeTaken })
  return res.data
}

export const fetchUserResults = async (): Promise<UserPartResult[]> => {
  const res = await api.get<UserPartResult[]>("/tests/user-results")
  return res.data
}

export const fetchPartResult = async (testId: string, partNum: number): Promise<PartResult | null> => {
  const res = await api.get<PartResult | null>(`/tests/${testId}/part/${partNum}/result`)
  return res.data
}

// ─── Full Test ───────────────────────────────────────────────────────────────

export const fetchFullTest = async (testId: string): Promise<TestPart & { sections: any[] }> => {
  const res = await api.get<TestPart & { sections: any[] }>(`/tests/${testId}/full`)
  return res.data
}

export const submitFullTest = async (
  testId: string,
  allAnswers: Record<string, Record<string, any>>,
  timeTaken?: number,
  mode?: "practice" | "mock"
): Promise<FullTestSubmitResponse> => {
  const res = await api.post<FullTestSubmitResponse>(`/tests/${testId}/full/submit`, { allAnswers, timeTaken, mode })
  return res.data
}

export const fetchFullTestResult = async (testId: string, skill: string): Promise<FullTestResult | null> => {
  const res = await api.get<FullTestResult | null>(`/tests/${testId}/full/result`, { params: { skill } })
  return res.data
}

export const fetchUserFullTestResults = async (): Promise<UserFullTestResult[]> => {
  const res = await api.get<UserFullTestResult[]>("/tests/full-results")
  return res.data
}

// ─── Books (Admin) ───────────────────────────────────────────────────────────

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await api.get<Book[]>("/admin/books")
  return res.data
}

export const fetchTestCount = async (): Promise<{ count: number }> => {
  const res = await api.get<{ count: number }>("/admin/tests/count")
  return res.data
}

export const fetchBookById = async (id: string): Promise<Book> => {
  const res = await api.get<Book>(`/admin/books/${id}`)
  return res.data
}

export const createBook = async (data: { number: number; title: string; status?: string }): Promise<Book> => {
  const res = await api.post<Book>("/admin/books", data)
  return res.data
}

export const updateBook = async ({ id, data }: { id: string; data: Record<string, unknown> }): Promise<Book> => {
  const res = await api.put<Book>(`/admin/books/${id}`, data)
  return res.data
}

export const deleteBook = async (id: string): Promise<Book> => {
  const res = await api.delete<Book>(`/admin/books/${id}`)
  return res.data
}

// ─── Tests (Admin) ───────────────────────────────────────────────────────────

export const fetchTests = async (bookId?: string): Promise<TestItem[]> => {
  const res = await api.get<TestItem[]>("/admin/tests", {
    params: typeof bookId === "string" ? { bookId } : undefined,
  })
  return res.data
}

export const fetchTestById = async (id: string): Promise<TestItem> => {
  const res = await api.get<TestItem>(`/admin/tests/${id}`)
  return res.data
}

export const createTest = async (data: Record<string, unknown>): Promise<TestItem> => {
  const res = await api.post<TestItem>("/admin/tests", data)
  return res.data
}

export const updateTest = async ({ id, data }: { id: string; data: Record<string, unknown> }): Promise<TestItem> => {
  const res = await api.put<TestItem>(`/admin/tests/${id}`, data)
  return res.data
}

export const publishTest = async (id: string): Promise<TestItem> => {
  const res = await api.patch<TestItem>(`/admin/tests/${id}/publish`)
  return res.data
}

export const deleteTest = async (id: string): Promise<TestItem> => {
  const res = await api.delete<TestItem>(`/admin/tests/${id}`)
  return res.data
}

// ─── Bug Reports ─────────────────────────────────────────────────────────────

export const submitBugReport = async (data: { description: string }): Promise<BugReport> => {
  const res = await api.post<BugReport>("/bug-reports", data)
  return res.data
}

export const fetchBugReports = async (): Promise<BugReport[]> => {
  const res = await api.get<BugReport[]>("/admin/bug-reports")
  return res.data
}

export const markBugReportAsFixed = async (id: string, fixed: boolean): Promise<BugReport> => {
  const res = await api.patch<BugReport>(`/admin/bug-reports/${id}/fixed`, { fixed })
  return res.data
}

export const deleteBugReport = async (id: string): Promise<BugReport> => {
  const res = await api.delete<BugReport>(`/admin/bug-reports/${id}`)
  return res.data
}

// ─── Users (Admin) ───────────────────────────────────────────────────────────

export const fetchUsers = async (
  params?: PaginationParams & { role?: string; status?: string }
): Promise<UsersResponse> => {
  const res = await api.get<UsersResponse>("/admin/users", { params })
  return res.data
}

export const updateUser = async ({ id, data }: { id: string; data: Record<string, unknown> }): Promise<User> => {
  const res = await api.patch<User>(`/admin/users/${id}`, data)
  return res.data
}

// ─── Drill Progress ──────────────────────────────────────────────────────────

export const fetchDrillProgress = async (drillId: string): Promise<{
  currentLevel: number
  completedLevels: number[]
  stars: Record<number, number>
  bestAccuracy: number
}> => {
  const res = await api.get(`/drill-progress/${drillId}`)
  return res.data
}

export const updateDrillProgress = async (
  drillId: string,
  data: { levelNumber: number; stars: number; accuracy: number }
): Promise<{
  currentLevel: number
  completedLevels: number[]
  stars: Record<number, number>
  bestAccuracy: number
}> => {
  const res = await api.put(`/drill-progress/${drillId}`, data)
  return res.data
}

// ─── Drill Schemas ───────────────────────────────────────────────────────────

export const fetchAllDrillSchemas = async (): Promise<{ drillId: string; schema: Record<string, unknown>; version: number }[]> => {
  const res = await api.get<{ drillId: string; schema: Record<string, unknown>; version: number }[]>("/drills")
  return res.data
}

export const fetchDrillSchema = async (drillId: string): Promise<{ schema: Record<string, unknown> }> => {
  const res = await api.get<{ schema: Record<string, unknown> }>(`/drills/${drillId}`)
  return res.data
}

export const updateDrillSchema = async (
  drillId: string,
  data: { schema: Record<string, unknown> }
): Promise<{ schema: Record<string, unknown> }> => {
  const res = await api.put<{ schema: Record<string, unknown> }>(`/admin/drills/${drillId}`, data)
  return res.data
}
