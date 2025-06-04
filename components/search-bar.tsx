"use client"

import { useState } from "react"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="mb-12">
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          className="neobrutalism-input w-full text-xl"
          placeholder="Search laws by keyword, topic, or case number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
