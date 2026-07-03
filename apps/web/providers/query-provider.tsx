"use client"

import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query"
import { toast } from "sonner"
import * as React from "react"

const ReactQueryDevtools = process.env.NODE_ENV === "development"
  ? React.lazy(() => import("@tanstack/react-query-devtools").then((m) => ({ default: m.ReactQueryDevtools })))
  : null

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
    mutationCache: new MutationCache({
      onError: (error: any) => {
        const message = error?.response?.data?.message || error.message || "An unexpected error occurred"
        toast.error(message)
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      )}
    </QueryClientProvider>
  )
}
