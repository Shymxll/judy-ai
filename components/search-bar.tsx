"use client"
import { useState } from "react"
import { Search } from "lucide-react"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  
  return (
    <div className="mb-12">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/60" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 text-lg bg-background/80 backdrop-blur-sm border border-foreground/10 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow/30 focus:border-yellow/50 hover:shadow-xl hover:bg-background/90 transition-all duration-300 placeholder-foreground/50 text-foreground"
            placeholder="Search laws by keyword, topic, or case number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}