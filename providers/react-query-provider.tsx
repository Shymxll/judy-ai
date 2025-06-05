"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { useState } from "react"

interface ReactQueryProviderProps {
    children: ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
    // QueryClient'ı state içinde tutmak, hot reload ve SSR için önerilir
    const [queryClient] = useState(() => new QueryClient())
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
} 