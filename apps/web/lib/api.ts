/**
 * Shared API query/mutation functions used with TanStack Query.
 * All functions use the centralized Axios client from lib/axios.ts,
 * so authentication headers added there will apply here automatically.
 */
import api from "@/lib/axios"

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const syncUserWithBackend = async (payload: { sub: string; email?: string; name?: string; picture?: string }) => {
  const res = await api.post("/auth/sync", payload)
  return res.data
}

// ─── Public ───────────────────────────────────────────────────────────────────

export const fetchPublicBooks = async () => {
  const res = await api.get("/books")
  return res.data
}

export const fetchPublicTests = async (params?: { bookId?: string; skill?: string }) => {
  const res = await api.get("/tests", { params })
  return res.data
}

export const fetchPublicTestPart = async (testId: string, partNum: number) => {
  const res = await api.get(`/tests/${testId}/part/${partNum}`)
  return res.data
}

export const submitTestPart = async (testId: string, partNum: number, answers: Record<string, any>) => {
  const res = await api.post(`/tests/${testId}/part/${partNum}/submit`, { answers })
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

// ─── Books ────────────────────────────────────────────────────────────────────

export const fetchBooks = async () => {
  const res = await api.get("/admin/books")
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

// ─── Tests ────────────────────────────────────────────────────────────────────

export const fetchTests = async () => {
  const res = await api.get("/admin/tests")
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
