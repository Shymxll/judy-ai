import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactQueryProvider } from "@/providers/react-query-provider"
import { SupabaseAuthProvider } from "@/providers/supabase-auth-provider"
import { Header } from "@/components/header"
import { NeoToastProvider } from "@/components/neo-toaster"
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "900"] })

export const metadata: Metadata = {
  title: "JudyAI - Let AI Create Laws for Your Conflicts",
  description: "Argue your case, let AI judge, and discover new laws created by artificial intelligence.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ReactQueryProvider>
            <SupabaseAuthProvider>
              <NeoToastProvider>
                <Header />
                {children}
              </NeoToastProvider>
            </SupabaseAuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
