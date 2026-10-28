"use client"

import { LibraryPage } from "@/components/library/library-page"

export default function ReadingPage() {
  return (
    <LibraryPage
      skill="reading"
      libraryLabel="REAL IELTS — READING LIBRARY"
      pageTitle="Reading Practice"
      pageDescription={
        "Select a book to start a full exam simulation or practice individual passages under real CD-IELTS conditions."
      }
      emptyTitle="No books match "
      emptyBody="Check your search term or clear the search to view all books."
      partsPerTest={3}
    />
  )
}
