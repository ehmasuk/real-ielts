// Mock data for admin dashboard and pages

export interface BookItem {
  id: string
  number: number
  title: string
  slug: string
  status: "published" | "draft"
  testsCount: number
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalBooks: number
  totalTests: number
  publishedTests: number
  draftTests: number
  archivedTests: number
  mediaAssets: number
  users: number
  recentImports: number
}

export interface ActivityItem {
  id: string
  type: "import" | "publish" | "update" | "error"
  title: string
  description: string
  timestamp: string
  user: string
}

export const dashboardStats: DashboardStats = {
  totalBooks: 21,
  totalTests: 168,
  publishedTests: 142,
  draftTests: 18,
  archivedTests: 8,
  mediaAssets: 356,
  users: 1247,
  recentImports: 5,
}

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    type: "publish",
    title: "Test Published",
    description: "Cambridge IELTS 20 — Test 3 Reading published",
    timestamp: "2 hours ago",
    user: "Admin",
  },
  {
    id: "a2",
    type: "import",
    title: "Import Completed",
    description: "Cambridge IELTS 20 — Test 4 Listening imported successfully",
    timestamp: "5 hours ago",
    user: "Editor",
  },
  {
    id: "a3",
    type: "update",
    title: "Test Updated",
    description: "Cambridge IELTS 19 — Test 2 Writing answer keys updated (v1.2)",
    timestamp: "1 day ago",
    user: "Admin",
  },
  {
    id: "a4",
    type: "error",
    title: "Validation Failed",
    description: "Cambridge IELTS 18 — Test 1 Listening: 3 missing answer keys",
    timestamp: "1 day ago",
    user: "System",
  },
  {
    id: "a5",
    type: "publish",
    title: "Test Published",
    description: "Cambridge IELTS 20 — Test 2 Listening published",
    timestamp: "2 days ago",
    user: "Admin",
  },
  {
    id: "a6",
    type: "import",
    title: "Import Completed",
    description: "Cambridge IELTS 20 — Test 1 full import (4 skills)",
    timestamp: "3 days ago",
    user: "Editor",
  },
]

export const booksData: BookItem[] = [
  {
    id: "b1",
    number: 20,
    title: "Cambridge IELTS 20",
    slug: "cambridge-ielts-20",
    status: "published",
    testsCount: 4,
    createdAt: "2025-11-15",
    updatedAt: "2026-06-20",
  },
  {
    id: "b2",
    number: 19,
    title: "Cambridge IELTS 19",
    slug: "cambridge-ielts-19",
    status: "published",
    testsCount: 4,
    createdAt: "2025-06-10",
    updatedAt: "2026-06-18",
  },
  {
    id: "b3",
    number: 18,
    title: "Cambridge IELTS 18",
    slug: "cambridge-ielts-18",
    status: "published",
    testsCount: 4,
    createdAt: "2024-11-20",
    updatedAt: "2026-05-12",
  },
  {
    id: "b4",
    number: 17,
    title: "Cambridge IELTS 17",
    slug: "cambridge-ielts-17",
    status: "published",
    testsCount: 4,
    createdAt: "2024-05-15",
    updatedAt: "2026-04-01",
  },
  {
    id: "b5",
    number: 16,
    title: "Cambridge IELTS 16",
    slug: "cambridge-ielts-16",
    status: "published",
    testsCount: 4,
    createdAt: "2023-11-10",
    updatedAt: "2026-03-15",
  },
  {
    id: "b6",
    number: 15,
    title: "Cambridge IELTS 15",
    slug: "cambridge-ielts-15",
    status: "published",
    testsCount: 4,
    createdAt: "2023-06-20",
    updatedAt: "2026-02-28",
  },
  {
    id: "b7",
    number: 14,
    title: "Cambridge IELTS 14",
    slug: "cambridge-ielts-14",
    status: "published",
    testsCount: 4,
    createdAt: "2023-01-15",
    updatedAt: "2026-01-20",
  },
  {
    id: "b8",
    number: 13,
    title: "Cambridge IELTS 13",
    slug: "cambridge-ielts-13",
    status: "draft",
    testsCount: 4,
    createdAt: "2022-08-10",
    updatedAt: "2025-12-15",
  },
  {
    id: "b9",
    number: 12,
    title: "Cambridge IELTS 12",
    slug: "cambridge-ielts-12",
    status: "draft",
    testsCount: 4,
    createdAt: "2022-03-05",
    updatedAt: "2025-11-01",
  },
]

export interface TestItem {
  id: string
  bookId: string
  bookNumber: number
  testNumber: number
  skill: "reading" | "listening" | "writing" | "speaking"
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  contentJson: string
  answerJson: string
}

export interface ImportLog {
  id: string
  filename: string
  status: "success" | "warning" | "failed"
  importedBy: string
  importedAt: string
  errors?: string[]
}

export const testsData: TestItem[] = [
  {
    id: "t1",
    bookId: "b1",
    bookNumber: 20,
    testNumber: 1,
    skill: "reading",
    status: "published",
    createdAt: "2026-06-20",
    updatedAt: "2026-06-20",
    contentJson: JSON.stringify({
      title: "Cambridge IELTS 20 Test 1 Reading",
      sections: [
        {
          id: "sec_1",
          title: "Reading Passage 1",
          passage: "This is the first reading passage. It contains information about language development...",
          questions: [
            { questionId: "q1", number: 1, type: "true-false-not-given", question: "Language acquisition is entirely biological.", options: [] },
            { questionId: "q2", number: 2, type: "true-false-not-given", question: "Environment plays a role in syntax learning.", options: [] }
          ]
        }
      ]
    }, null, 2),
    answerJson: JSON.stringify({
      answers: {
        q1: "FALSE",
        q2: "TRUE"
      }
    }, null, 2)
  },
  {
    id: "t2",
    bookId: "b1",
    bookNumber: 20,
    testNumber: 1,
    skill: "listening",
    status: "draft",
    createdAt: "2026-06-21",
    updatedAt: "2026-06-21",
    contentJson: JSON.stringify({
      title: "Cambridge IELTS 20 Test 1 Listening",
      audioUrl: "/audio/c20_t1_l.mp3",
      sections: [
        {
          id: "sec_1",
          title: "Section 1",
          questions: [
            { questionId: "q1", number: 1, type: "sentence_completion", question: "Name of the caller: [blank]", options: [] }
          ]
        }
      ]
    }, null, 2),
    answerJson: JSON.stringify({
      answers: {
        q1: "John Smith"
      }
    }, null, 2)
  }
]

export const importLogsData: ImportLog[] = [
  {
    id: "l1",
    filename: "c20_test1_reading.json",
    status: "success",
    importedBy: "Admin User",
    importedAt: "2026-06-20 14:32"
  },
  {
    id: "l2",
    filename: "c20_test1_listening_corrupted.json",
    status: "failed",
    importedBy: "Admin User",
    importedAt: "2026-06-21 09:15",
    errors: ["SyntaxError: Unexpected token } in JSON at position 142", "SchemaError: Missing required field 'audioUrl' for Listening skill"]
  }
]
