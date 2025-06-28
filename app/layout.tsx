import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactQueryProvider } from "@/providers/react-query-provider"
import { SupabaseAuthProvider } from "@/providers/supabase-auth-provider"
import { Header } from "@/components/header"
import { BoltBadge } from "@/components/bolt-badge"

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter"
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta"
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains"
})

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
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${jetBrainsMono.variable} font-sans dark:bg-background dark:border-border bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ReactQueryProvider>
            <SupabaseAuthProvider>
                <Header />
                {children}
                <BoltBadge />
            </SupabaseAuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}