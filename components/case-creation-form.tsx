"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { ChevronLeft, ChevronRight, Check, AlertCircle, Mail, User, FileText } from "lucide-react"

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

  const progress = (step / 3) * 100

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return caseData.title.trim() && caseData.yourSide.trim()
      case 2:
        return caseData.friendEmail.trim() && /\S+@\S+\.\S+/.test(caseData.friendEmail)
      case 3:
        return true
      default:
        return false
    }
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Create Your Case</CardTitle>
            <CardDescription>Step {step} of 3</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${num < step
                  ? "bg-primary text-primary-foreground"
                  : num === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {num < step ? <Check className="h-4 w-4" /> : num}
              </div>
            ))}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-heading">Tell Us About Your Conflict</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Case Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Roommate refuses to pay utilities"
                value={caseData.title}
                onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yourSide" className="text-base font-medium">
                Your Side of the Story *
              </Label>
              <Textarea
                id="yourSide"
                placeholder="Explain your perspective in detail. Include relevant facts, dates, and context that support your position..."
                value={caseData.yourSide}
                onChange={(e) => setCaseData({ ...caseData, yourSide: e.target.value })}
                className="min-h-[150px] text-base resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Be thorough and objective. This information will be shared with the other party.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-heading">Invite the Other Party</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="friendEmail" className="text-base font-medium">
                Their Email Address *
              </Label>
              <Input
                id="friendEmail"
                type="email"
                placeholder="friend@example.com"
                value={caseData.friendEmail}
                onChange={(e) => setCaseData({ ...caseData, friendEmail: e.target.value })}
                className="text-base"
              />
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  What happens next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <p className="text-sm">We'll send them an invitation to present their side</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <p className="text-sm">Both parties will answer AI-generated questions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <p className="text-sm">AI will analyze and create a fair resolution</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-heading">Review Your Case</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Case Title</Label>
                <Card className="p-4">
                  <p className="text-base">{caseData.title}</p>
                </Card>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Your Perspective</Label>
                <Card className="p-4">
                  <p className="text-base whitespace-pre-wrap">{caseData.yourSide}</p>
                </Card>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Invited Party</Label>
                <Card className="p-4">
                  <p className="text-base">{caseData.friendEmail}</p>
                </Card>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  By submitting this case, you agree that all information provided is accurate and that both parties
                  consent to AI-mediated resolution. The other party will be notified via email.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Separator />

        <div className="flex justify-between items-center pt-4">
          {step > 1 ? (
            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !isStepValid()}
                className="flex items-center gap-2"
              >
                {loading ? "Submitting..." : "Submit Case"}
                {!loading && <Check className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
