/**
 * Shared domain types for the Real IELTS frontend.
 *
 * These mirror the backend API responses so the UI layer is typed,
 * self-documenting, and resilient to backend shape changes.
 */

export type BookCategory = "Cambridge" | "Recent Questions"

export interface Book {
  _id: string
  number?: number
  title: string
  slug: string
  category?: BookCategory | string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface TestItem {
  _id: string
  bookId: string | { _id: string; number?: number; title?: string }
  testNumber: number
  skill: string
  status: string
  contentJson?: { sections?: Array<{ id: string }> }
}

export interface TestPart {
  testId: string
  testNumber: number
  skill: string
  title: string
  section: any
  totalSections: number
}

export interface QuestionResult {
  questionId: string
  correct: boolean
  score: number
  maxScore: number
  userAnswer: any
  correctAnswer: any
}

export interface PartResult {
  results: QuestionResult[]
  score: number
  total: number
}

export interface UserPartResult {
  testId: string
  partNum: number
  score: number
  total: number
}

export interface FullTestPart {
  partNum: number
  score: number
  total: number
  results: QuestionResult[]
}

export interface FullTestResult {
  parts: FullTestPart[]
  totalScore: number
  totalMax: number
  timeTaken: number
  mode: string
  submittedAt: string
  testNumber?: number
  title?: string
  skill?: string
  sections?: any[]
}

export interface FullTestSubmitResponse {
  parts: FullTestPart[]
  totalScore: number
  totalMax: number
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserFullTestResult {
  testId: string
  skill: string
  totalScore: number
  totalMax: number
}

export interface DrillManifest {
  id: string
  title: string
  description: string
  icon: string
  category: string
  skills: string[]
  schema: Record<string, unknown>
}

export interface BugReport {
  _id: string
  description: string
  status?: string
  createdAt?: string
}

export interface User {
  _id: string
  googleId?: string
  email: string
  name: string
  picture?: string
  role: string
  status: string
  lastLoginAt?: string
  testsAttempted: number
  createdAt: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}
