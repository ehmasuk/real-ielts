"use client"

import { LibraryPage } from "@/components/library/library-page"

export default function ListeningPage() {
  return (
    <LibraryPage
      skill="listening"
      libraryLabel="REAL IELTS — LISTENING LIBRARY"
      pageTitle="Listening Practice"
      pageDescription={
        "Select a book to start a full exam simulation or practice individual parts under real CD-IELTS conditions."
      }
      emptyTitle="No books match "
      emptyBody="Check your search term or clear the search to view all books."
      partsPerTest={4}
    />
  )
}
