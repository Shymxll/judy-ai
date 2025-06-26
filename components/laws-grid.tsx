import React, { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import {
  likeLaw,
  dislikeLaw,
  getLawLikes,
  getUserLawLike,
} from "@/lib/caseService"
import { useRouter } from "next/navigation"

type Law = {
  id: string
  title: string
  text: string
  created_at: string
  case_id?: string
  category?: string
  fair?: number
  unfair?: number
}

type Props = {
  laws: Law[]
}

export const LawsGrid: React.FC<Props> = ({ laws }) => {
  const { user } = useSupabaseAuth()
  const router = useRouter()
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null)
  const [likes, setLikes] = useState<Record<string, { fair: number; unfair: number }>>({})
  const [userVotes, setUserVotes] = useState<Record<string, "like" | "dislike" | null>>({})
  const [loadingVote, setLoadingVote] = useState<string | null>(null)

  useEffect(() => {
    // Fetch like/dislike counts and user votes for all laws
    const fetchAllLikes = async () => {
      const newLikes: Record<string, { fair: number; unfair: number }> = {}
      const newUserVotes: Record<string, "like" | "dislike" | null> = {}
      for (const law of laws) {
        try {
          const likeCounts = await getLawLikes(law.id)
          newLikes[law.id] = likeCounts
          if (user) {
            const vote = await getUserLawLike(law.id, user.id)
            newUserVotes[law.id] = vote
          } else {
            newUserVotes[law.id] = null
          }
        } catch {
          newLikes[law.id] = { fair: 0, unfair: 0 }
          newUserVotes[law.id] = null
        }
      }
      setLikes(newLikes)
      setUserVotes(newUserVotes)
    }
    if (laws.length) fetchAllLikes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laws, user])

  const handleVote = async (lawId: string, type: "like" | "dislike") => {
    if (!user) {
      router.push("/login")
      return
    }
    setLoadingVote(lawId + type)
    try {
      if (type === "like") {
        await likeLaw(lawId, user.id)
      } else {
        await dislikeLaw(lawId, user.id)
      }
      // Refresh counts and user vote
      const likeCounts = await getLawLikes(lawId)
      setLikes((prev) => ({ ...prev, [lawId]: likeCounts }))
      setUserVotes((prev) => ({ ...prev, [lawId]: type }))
    } catch { }
    setLoadingVote(null)
  }

  if (!laws.length) return <div className="text-center text-muted-foreground py-8">No laws found.</div>
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {laws.map((law) => {
          const vote = userVotes[law.id]
          const fair = likes[law.id]?.fair ?? "-"
          const unfair = likes[law.id]?.unfair ?? "-"
          return (
            <div key={law.id} className="relative">
              <button
                className="block text-left w-full focus:outline-none"
                onClick={() => setSelectedLaw(law)}
                aria-label={`Show details for ${law.title}`}
              >
                <div className="neobrutalism-card p-6 hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer rounded-md">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-yellow border-2 border-border text-sm font-heading rounded-md">
                      {law.category || "N/A"}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading mb-2">{law.title}</h3>
                  <p className="text-sm font-base text-foreground/70 mb-3">Case #{law.case_id || "N/A"}</p>
                  <p className="text-base font-base mb-4 line-clamp-3">{law.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        className={`flex items-center space-x-1 text-2xl focus:outline-none hover:scale-125 transition-transform cursor-pointer ${vote === "like" ? "text-green-600" : "text-gray-700 dark:text-gray-200"}`}
                        onClick={e => { e.stopPropagation(); handleVote(law.id, "like") }}
                        disabled={loadingVote === law.id + "like"}
                        aria-label="Like"
                      >
                        <span>👍</span>
                        <span className="font-heading text-base">{fair}</span>
                        {loadingVote === law.id + "like" && <span className="ml-1 animate-spin">⏳</span>}
                      </button>
                      <button
                        className={`flex items-center space-x-1 text-2xl focus:outline-none hover:scale-125 transition-transform cursor-pointer ${vote === "dislike" ? "text-red-600" : "text-gray-700 dark:text-gray-200"}`}
                        onClick={e => { e.stopPropagation(); handleVote(law.id, "dislike") }}
                        disabled={loadingVote === law.id + "dislike"}
                        aria-label="Dislike"
                      >
                        <span>👎</span>
                        <span className="font-heading text-base">{unfair}</span>
                        {loadingVote === law.id + "dislike" && <span className="ml-1 animate-spin">⏳</span>}
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(law.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>
      {/* Modal/Overlay for selected law */}
      {selectedLaw && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedLaw(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-lg w-full p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              onClick={() => setSelectedLaw(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-yellow border-2 border-border text-sm font-heading rounded-md">
                {selectedLaw.category || "N/A"}
              </span>
            </div>
            <h2 className="text-2xl font-heading mb-2">{selectedLaw.title}</h2>
            <p className="text-sm font-base text-foreground/70 mb-2">Case #{selectedLaw.case_id || "N/A"}</p>
            <div className="text-base text-gray-700 dark:text-gray-200 mb-4 whitespace-pre-line">{selectedLaw.text}</div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">👍</span>
                  <span className="font-heading">{likes[selectedLaw.id]?.fair ?? "-"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">👎</span>
                  <span className="font-heading">{likes[selectedLaw.id]?.unfair ?? "-"}</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{new Date(selectedLaw.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
