"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function BoltBadge() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hydration hatalarını önlemek için
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const imageSrc = resolvedTheme === "dark" ? "/assets/black.png" : "/assets/white.png"
  const altText = "Built with Bolt.new AI"

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label="Built with Bolt.new AI - Visit Bolt.new"
      >
        <Image
          src={imageSrc}
          alt={altText}
          width={120}
          height={40}
          className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-200"
          priority
        />
      </Link>
    </div>
  )
}