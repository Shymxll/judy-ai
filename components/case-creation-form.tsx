"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export function CaseCreationForm() {
  const [step, setStep] = useState(1)
  const [caseData, setCaseData] = useState({
    title: "",
    yourSide: "",
    friendEmail: "",
    friendSide: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useSupabaseAuth()
  const router = useRouter()

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      if (!user) {
        setError("You must be logged in to create a case.")
        setLoading(false)
        return
      }
      // 1. Case oluştur
      const { data: caseInsert, error: caseError } = await supabase
        .from("cases")
        .insert({
          creator_id: user.id,
          title: caseData.title,
          description: caseData.yourSide,
          status: "waiting",
        })
        .select()
        .single()
      if (caseError || !caseInsert) throw new Error(caseError?.message || "Case creation failed.")
      // 2. Creator participant ekle
      const { data: creatorParticipant, error: creatorError } = await supabase
        .from("case_participants")
        .insert({
          case_id: caseInsert.id,
          user_id: user.id,
          email: user.email,
          role: "creator",
          joined_at: new Date().toISOString(),
        })
        .select()
        .single()
      if (creatorError || !creatorParticipant) throw new Error(creatorError?.message || "Creator participant failed.")
      // 3. Friend participant ekle
      const { data: friendParticipant, error: friendError } = await supabase
        .from("case_participants")
        .insert({
          case_id: caseInsert.id,
          email: caseData.friendEmail,
          role: "invited",
        })
        .select()
        .single()
      if (friendError || !friendParticipant) throw new Error(friendError?.message || "Friend participant failed.")
      // 4. Creator detayını ekle
      const { error: detailError } = await supabase
        .from("case_details")
        .insert({
          case_id: caseInsert.id,
          participant_id: creatorParticipant.id,
          details: caseData.yourSide,
        })
      if (detailError) throw new Error(detailError.message)
      // Başarılıysa yönlendir
      router.push("/my-cases")
    } catch (err: any) {
      setError(err.message || "An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="neobrutalism-card p-8 rounded-md">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-heading">Step {step} of 3</h2>
          <div className="flex space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-4 h-4 border-2 border-border ${num <= step ? "bg-yellow" : "bg-secondary-background"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xl font-heading mb-2">Case Title</label>
            <input
              type="text"
              className="neobrutalism-input w-full rounded-md"
              placeholder="Briefly describe your conflict..."
              value={caseData.title}
              onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xl font-heading mb-2">Your Side of the Story</label>
            <textarea
              className="neobrutalism-input w-full h-40 resize-none rounded-md"
              placeholder="Explain your perspective in detail..."
              value={caseData.yourSide}
              onChange={(e) => setCaseData({ ...caseData, yourSide: e.target.value })}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xl font-heading mb-2">Friend's Email</label>
            <input
              type="email"
              className="neobrutalism-input w-full rounded-md"
              placeholder="friend@example.com"
              value={caseData.friendEmail}
              onChange={(e) => setCaseData({ ...caseData, friendEmail: e.target.value })}
            />
          </div>

          <div className="neobrutalism-card p-6 bg-yellow/20 rounded-md">
            <h3 className="text-lg font-heading mb-2">What happens next?</h3>
            <p className="font-base">
              We'll send your friend an invitation to present their side of the story. Once both perspectives are
              submitted, our AI will analyze the case and create a fair law.
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-heading mb-4">Review Your Case</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-heading">Title:</h4>
              <p className="font-base">{caseData.title}</p>
            </div>

            <div>
              <h4 className="text-lg font-heading">Your Perspective:</h4>
              <p className="font-base">{caseData.yourSide}</p>
            </div>

            <div>
              <h4 className="text-lg font-heading">Friend's Email:</h4>
              <p className="font-base">{caseData.friendEmail}</p>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-600 mb-4" role="alert">{error}</div>}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button onClick={handleBack} className="neobrutalism-button bg-secondary-background">
            Back
          </Button>
        )}

        <div className="ml-auto">
          {step < 3 ? (
            <Button onClick={handleNext} className="neobrutalism-button bg-green">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="neobrutalism-button bg-red" disabled={loading} aria-busy={loading}>
              {loading ? "Submitting..." : "Submit Case"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
