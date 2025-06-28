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

  if (!laws.length) return (
    <div className="text-center py-16">
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-foreground/10 shadow-lg max-w-md mx-auto p-8">
        <h3 className="text-xl font-heading text-foreground mb-2">No Laws Found</h3>
        <p className="text-foreground/70">Try adjusting your search criteria</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {laws.map((law) => {
          const vote = userVotes[law.id]
          const fair = likes[law.id]?.fair ?? "-"
          const unfair = likes[law.id]?.unfair ?? "-"
          return (
            <div key={law.id} className="relative group">
              <button
                className="block text-left w-full focus:outline-none focus:ring-4 focus:ring-yellow/30 rounded-2xl"
                onClick={() => setSelectedLaw(law)}
                aria-label={`Show details for ${law.title}`}
              >
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-foreground/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-6 h-full flex flex-col group-hover:scale-105 group-hover:bg-background/90">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow to-red text-sm font-heading text-foreground rounded-full shadow-sm">
                      {law.category || "General"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-heading text-foreground mb-3 leading-tight group-hover:text-yellow transition-colors">{law.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow/30 to-red/30 rounded-full flex items-center justify-center border border-foreground/20">
                      <span className="text-xs font-heading text-foreground">#</span>
                    </div>
                    <p className="text-sm font-base text-foreground/70">Case {law.case_id || "N/A"}</p>
                  </div>
                  
                  <p className="text-base text-foreground/80 mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {law.text}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                    <div className="flex items-center space-x-6">
                      <button
                        className={`flex items-center space-x-2 focus:outline-none hover:scale-110 transition-transform duration-200 ${
                          vote === "like" 
                            ? "text-green-600" 
                            : "text-foreground/70 hover:text-green-600"
                        }`}
                        onClick={e => { e.stopPropagation(); handleVote(law.id, "like") }}
                        disabled={loadingVote === law.id + "like"}
                        aria-label="Like this law"
                      >
                        <span className="text-xl">👍</span>
                        <span className="font-heading text-sm font-medium">{fair}</span>
                        {loadingVote === law.id + "like" && (
                          <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </button>
                      
                      <button
                        className={`flex items-center space-x-2 focus:outline-none hover:scale-110 transition-transform duration-200 ${
                          vote === "dislike" 
                            ? "text-red-600" 
                            : "text-foreground/70 hover:text-red-600"
                        }`}
                        onClick={e => { e.stopPropagation(); handleVote(law.id, "dislike") }}
                        disabled={loadingVote === law.id + "dislike"}
                        aria-label="Dislike this law"
                      >
                        <span className="text-xl">👎</span>
                        <span className="font-heading text-sm font-medium">{unfair}</span>
                        {loadingVote === law.id + "dislike" && (
                          <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </button>
                    </div>
                    
                    <time className="text-xs text-foreground/60 font-base">
                      {new Date(law.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedLaw(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-background/90 backdrop-blur-sm rounded-2xl border border-foreground/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-background/95 to-background/90 border-b border-foreground/10 p-6 rounded-t-2xl backdrop-blur-sm">
              <button
                className="absolute top-4 right-4 w-8 h-8 bg-background/80 border border-foreground/20 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-yellow/20 hover:to-red/20 focus:outline-none focus:ring-2 focus:ring-yellow/30 transition-all"
                onClick={() => setSelectedLaw(null)}
                aria-label="Close modal"
              >
                <span className="text-lg">×</span>
              </button>
              
              <div className="mb-3">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow to-red text-sm font-heading text-foreground rounded-full shadow-sm">
                  {selectedLaw.category || "General"}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-heading text-foreground mb-2 pr-12 leading-tight">
                {selectedLaw.title}
              </h2>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow/30 to-red/30 rounded-full flex items-center justify-center border border-foreground/20">
                  <span className="text-xs font-heading text-foreground">#</span>
                </div>
                <p className="text-sm font-base text-foreground/70">Case {selectedLaw.case_id || "N/A"}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose prose-neutral max-w-none mb-6">
                <div className="text-base text-foreground/80 leading-relaxed whitespace-pre-line font-base">
                  {selectedLaw.text}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full border-2 border-green-200">
                      <span className="text-xl">👍</span>
                    </div>
                    <div>
                      <div className="text-lg font-heading font-medium text-green-600">
                        {likes[selectedLaw.id]?.fair ?? "-"}
                      </div>
                      <div className="text-xs text-green-600/70 font-base">Fair</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full border-2 border-red-200">
                      <span className="text-xl">👎</span>
                    </div>
                    <div>
                      <div className="text-lg font-heading font-medium text-red-600">
                        {likes[selectedLaw.id]?.unfair ?? "-"}
                      </div>
                      <div className="text-xs text-red-600/70 font-base">Unfair</div>
                    </div>
                  </div>
                </div>
                
                <time className="text-sm text-foreground/60 font-base">
                  {new Date(selectedLaw.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}