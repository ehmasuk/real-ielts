/**
 * Shared API query/mutation functions used with TanStack Query.
 * All functions use the centralized Axios client from lib/axios.ts,
 * so authentication headers added there will apply here automatically.
 */
import api from "@/lib/axios"

// ─── Public ───────────────────────────────────────────────────────────────────

export const fetchPublicBooks = async () => {
  const res = await api.get("/books")
  return res.data
}

export const fetchBookCount = async () => {
  const res = await api.get("/books/count")
  return res.data
}

export const fetchPublicTests = async (params?: { bookId?: string; skill?: string }) => {
  const res = await api.get("/tests", { params })
  return res.data
}

export const fetchPublicTestsList = async (params?: { bookId?: string; skill?: string }) => {
  const res = await api.get("/tests/list", { params })
  return res.data
}

export const fetchPublicTest = async (testId: string) => {
  const res = await api.get(`/tests/${testId}`)
  return res.data
}

export const fetchPublicTestPart = async (testId: string, partNum: number) => {
  const res = await api.get(`/tests/${testId}/part/${partNum}`)
  return res.data
}

export const submitTestPart = async (testId: string, partNum: number, answers: Record<string, any>, timeTaken?: number) => {
  const res = await api.post(`/tests/${testId}/part/${partNum}/submit`, { answers, timeTaken })
  return res.data
}

export const fetchUserResults = async () => {
  const res = await api.get("/tests/user-results")
  return res.data
}

export const fetchPartResult = async (testId: string, partNum: number) => {
  const res = await api.get(`/tests/${testId}/part/${partNum}/result`)
  return res.data
}

// ─── Full Test ───────────────────────────────────────────────────────────────

export const fetchFullTest = async (testId: string) => {
  const res = await api.get(`/tests/${testId}/full`)
  return res.data
}

export const submitFullTest = async (
  testId: string,
  allAnswers: Record<string, Record<string, any>>,
  timeTaken?: number,
  mode?: "practice" | "mock"
) => {
  const res = await api.post(`/tests/${testId}/full/submit`, { allAnswers, timeTaken, mode })
  return res.data
}

export const fetchFullTestResult = async (testId: string, skill: string) => {
  const res = await api.get(`/tests/${testId}/full/result`, { params: { skill } })
  return res.data
}

export const fetchUserFullTestResults = async () => {
  const res = await api.get("/tests/full-results")
  return res.data
}

// ─── Books ────────────────────────────────────────────────────────────────────

export const fetchBooks = async () => {
  const res = await api.get("/admin/books")
  return res.data
}

export const fetchTestCount = async () => {
  const res = await api.get("/admin/tests/count")
  return res.data
}

export const fetchBookById = async (id: string) => {
  const res = await api.get(`/admin/books/${id}`)
  return res.data
}

export const createBook = async (data: { number: number; title: string; status?: string }) => {
  const res = await api.post("/admin/books", data)
  return res.data
}

export const updateBook = async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  const res = await api.put(`/admin/books/${id}`, data)
  return res.data
}

export const deleteBook = async (id: string) => {
  const res = await api.delete(`/admin/books/${id}`)
  return res.data
}

// ─── Tests ────────────────────────────────────────────────────────────────────

export const fetchTests = async (bookId?: string) => {
  const res = await api.get("/admin/tests", {
    params: typeof bookId === "string" ? { bookId } : undefined,
  })
  return res.data
}

export const fetchTestById = async (id: string) => {
  const res = await api.get(`/admin/tests/${id}`)
  return res.data
}

export const createTest = async (data: Record<string, unknown>) => {
  const res = await api.post("/admin/tests", data)
  return res.data
}

export const updateTest = async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  const res = await api.put(`/admin/tests/${id}`, data)
  return res.data
}

export const publishTest = async (id: string) => {
  const res = await api.patch(`/admin/tests/${id}/publish`)
  return res.data
}

export const deleteTest = async (id: string) => {
  const res = await api.delete(`/admin/tests/${id}`)
  return res.data
}

// ─── Bug Reports ──────────────────────────────────────────────────────────────

export const submitBugReport = async (data: { description: string }) => {
  const res = await api.post("/bug-reports", data)
  return res.data
}

export const fetchBugReports = async () => {
  const res = await api.get("/admin/bug-reports")
  return res.data
}

export const markBugReportAsFixed = async (id: string, fixed: boolean) => {
  const res = await api.patch(`/admin/bug-reports/${id}/fixed`, { fixed })
  return res.data
}

export const deleteBugReport = async (id: string) => {
  const res = await api.delete(`/admin/bug-reports/${id}`)
  return res.data
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const fetchUsers = async (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => {
  const res = await api.get("/admin/users", { params })
  return res.data
}

export const updateUser = async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
  const res = await api.patch(`/admin/users/${id}`, data)
  return res.data
}

// ─── Drill Progress ───────────────────────────────────────────────────────────

export const fetchDrillProgress = async (drillId: string) => {
  const res = await api.get(`/drills/${drillId}`)
  return res.data
}

export const updateDrillProgress = async (drillId: string, data: { levelNumber: number; stars: number; accuracy: number }) => {
  const res = await api.put(`/drills/${drillId}`, data)
  return res.data
}

// ─── Drill Schema ─────────────────────────────────────────────────────────────

export const fetchAllDrillSchemas = async () => {
  const res = await api.get("/drill-schema")
  return res.data
}

export const fetchDrillSchema = async (drillId: string) => {
  const res = await api.get(`/drill-schema/${drillId}`)
  return res.data
}

export const updateDrillSchema = async (drillId: string, schema: Record<string, unknown>) => {
  const res = await api.put(`/admin/drill-schema/${drillId}`, { schema })
  return res.data
}
