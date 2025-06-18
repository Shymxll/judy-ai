"use client"

import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabaseClient"
import { triggerQuestionGeneration } from "@/lib/webhooks"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { FaGavel } from "react-icons/fa"
import { GiCrown } from "react-icons/gi"
import { CaseQuestionAnswer } from "./components/case-question-answer"

export enum CaseStatus {
    WAITING = "waiting",
    WAITING_FOR_PROSECUTOR = "waiting_for_prosecutor",
    WAITING_FOR_JUDGE = "waiting_for_judge",
    WAITING_FOR_COURT = "waiting_for_court",
    WAITING_FOR_EXECUTION = "waiting_for_execution",
    WAITING_FOR_ANSWER = "waiting_for_answer",
    WAITING_FOR_ANALYSIS = "waiting_for_analysis",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DELETED = "deleted",
    CLOSED = "closed",
}

export default function CaseDetailPage({ params }: { params: { id: string } }) {
    const { user } = useSupabaseAuth()
    const { id } = params
    if (!id || typeof id !== "string") {
        return <div className="text-center py-12 text-red-600 font-heading text-xl">Geçersiz veya eksik case ID</div>
    }
    const [caseData, setCaseData] = useState<any>(null)
    const [participants, setParticipants] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [allQuestions, setAllQuestions] = useState<any[]>([]) // Tüm katılımcıların soruları
    const [answers, setAnswers] = useState<any[]>([])
    const [allAnswers, setAllAnswers] = useState<any[]>([]) // Tüm katılımcıların cevapları
    const [details, setDetails] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [answerInputs, setAnswerInputs] = useState<{ [questionId: string]: string }>({})
    const [submitting, setSubmitting] = useState(false)
    const [detailInput, setDetailInput] = useState("")
    const [detailSubmitting, setDetailSubmitting] = useState(false)

    // Kullanıcının participant kaydını bul
    const myParticipant = participants.find(
        (p) => p.user_id === user?.id || p.email === user?.email
    )

    // Tüm sorular cevaplanmış mı kontrol et
    const checkAllQuestionsAnswered = async () => {
        try {
            console.log("🔍 Checking if all questions are answered...")

            // Fresh data çek - state'e güvenme
            const { data: freshParticipants, error: partErr } = await supabase
                .from("case_participants")
                .select("*")
                .eq("case_id", id)

            if (partErr) {
                console.error("Participants fetch error:", partErr.message)
                return false
            }

            const { data: freshQuestions, error: questErr } = await supabase
                .from("case_questions")
                .select("*")
                .eq("case_id", id)

            if (questErr) {
                console.error("Questions fetch error:", questErr.message)
                return false
            }

            const { data: freshAnswers, error: ansErr } = await supabase
                .from("case_answers")
                .select("*")
                .in("question_id", (freshQuestions || []).map((q: any) => q.id))

            if (ansErr) {
                console.error("Answers fetch error:", ansErr.message)
                return false
            }

            console.log("📊 Fresh data:", {
                participants: freshParticipants?.length || 0,
                questions: freshQuestions?.length || 0,
                answers: freshAnswers?.length || 0
            })

            // Her katılımcı için kontrol et
            let allCompleted = true
            for (const participant of freshParticipants || []) {
                const participantQuestions = (freshQuestions || []).filter(q => q.participant_id === participant.id)
                const participantAnswers = (freshAnswers || []).filter(a =>
                    participantQuestions.some(q => q.id === a.question_id)
                )

                const unansweredCount = participantQuestions.length - participantAnswers.length

                console.log(`👤 Participant ${participant.email}:`, {
                    questions: participantQuestions.length,
                    answers: participantAnswers.length,
                    unanswered: unansweredCount
                })

                if (unansweredCount > 0) {
                    console.log(`❌ ${participant.email} still has ${unansweredCount} unanswered questions`)
                    allCompleted = false
                    break
                }
            }

            if (!allCompleted) {
                console.log("⏳ Not all questions answered yet")
                return false
            }

            console.log("✅ All questions answered! Updating case status...")

            // Case status'unu güncelle
            if (caseData && caseData.status !== CaseStatus.WAITING_FOR_ANALYSIS) {
                const { error: updateErr } = await supabase
                    .from("cases")
                    .update({ status: CaseStatus.WAITING_FOR_ANALYSIS })
                    .eq("id", id)

                if (updateErr) {
                    console.error("❌ Case status update error:", updateErr.message)
                    return false
                }

                setCaseData((prev: any) => ({ ...prev, status: CaseStatus.WAITING_FOR_ANALYSIS }))
                console.log("🎉 Case status updated to WAITING_FOR_ANALYSIS!")
                return true
            } else {
                console.log("ℹ️ Case status already WAITING_FOR_ANALYSIS or no case data")
                return true
            }

        } catch (err: any) {
            console.error("❌ Error in checkAllQuestionsAnswered:", err.message)
            return false
        }
    }

    useEffect(() => {
        console.log("id:", id, "user:", user)
        if (!id || typeof id !== "string" || !user) return
        const fetchData = async () => {
            setLoading(true)
            setError("")
            try {
                console.log("Supabase sorgusu id:", id)
                // Case
                const { data: caseRow, error: caseErr } = await supabase
                    .from("cases")
                    .select("*")
                    .eq("id", id)
                    .single()
                if (caseErr) throw new Error(caseErr.message)
                setCaseData(caseRow)

                // Participants
                const { data: parts, error: partErr } = await supabase
                    .from("case_participants")
                    .select("*")
                    .eq("case_id", id)
                if (partErr) throw new Error(partErr.message)
                setParticipants(parts || [])

                // Tüm katılımcıların sorularını getir
                const { data: allQs, error: allQsErr } = await supabase
                    .from("case_questions")
                    .select("*")
                    .eq("case_id", id)
                if (allQsErr) throw new Error(allQsErr.message)
                setAllQuestions(allQs || [])

                // Tüm katılımcıların cevaplarını getir
                if (allQs && allQs.length > 0) {
                    const { data: allAs, error: allAsErr } = await supabase
                        .from("case_answers")
                        .select("*")
                        .in("question_id", allQs.map((q: any) => q.id))
                    if (allAsErr) throw new Error(allAsErr.message)
                    setAllAnswers(allAs || [])
                } else {
                    setAllAnswers([])
                }

                // Kullanıcının participant kaydını bul
                const myPart = parts?.find((p) => p.user_id === user?.id || p.email === user?.email)

                // My Questions
                let qs: any[] = []
                if (myPart?.id && allQs) {
                    qs = allQs.filter((q) => q.participant_id === myPart.id)
                    setQuestions(qs)
                } else {
                    setQuestions([])
                }

                // My Answers
                if (myPart?.id && qs && qs.length > 0) {
                    const result = await supabase
                        .from("case_answers")
                        .select("*")
                        .in("question_id", qs.map((q: any) => q.id))
                        .eq("participant_id", myPart.id)
                    const ans = result.data || []
                    const aErr = result.error
                    if (aErr) throw new Error(aErr.message)
                    setAnswers(ans)
                } else {
                    setAnswers([])
                }

                // Details
                const { data: dets, error: detErr } = await supabase
                    .from("case_details")
                    .select("*")
                    .eq("case_id", id)
                if (detErr) throw new Error(detErr.message)
                setDetails(dets || [])
            } catch (err: any) {
                setError(err.message || "An error occurred.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user])

    // Cevaplanmamış sorular
    const unanswered = questions.filter(
        (q) => !answers.find((a) => a.question_id === q.id)
    )
    // Cevaplanmış sorular
    const answered = questions.filter(
        (q) => answers.find((a) => a.question_id === q.id)
    )

    // Creator ve invited detayları
    const creatorParticipant = participants.find((p) => p.role === "creator")
    const invitedParticipant = participants.find((p) => p.role === "invited")
    const creatorDetail = details.find((d) => d.participant_id === creatorParticipant?.id)
    const invitedDetail = details.find((d) => d.participant_id === invitedParticipant?.id)
    const isInvited = myParticipant?.role === "invited"
    const hasWrittenDetail = !!details.find((d) => d.participant_id === myParticipant?.id)

    const handleAnswerChange = (qid: string, value: string) => {
        setAnswerInputs((prev) => ({ ...prev, [qid]: value }))
    }

    const handleSubmitAnswer = async (qid: string) => {
        if (!myParticipant) return
        setSubmitting(true)
        setError("")
        try {
            const answer = answerInputs[qid]
            if (!answer) return
            const { error: ansErr } = await supabase
                .from("case_answers")
                .insert({
                    question_id: qid,
                    participant_id: myParticipant.id,
                    answer,
                })
            if (ansErr) throw new Error(ansErr.message)
            setAnswers((prev) => [...prev, { question_id: qid, answer }])
            setAnswerInputs((prev) => ({ ...prev, [qid]: "" }))
        } catch (err: any) {
            setError(err.message || "An error occurred.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmitDetail = async () => {
        if (!myParticipant) return
        setDetailSubmitting(true)
        setError("")
        try {
            if (!detailInput) return
            const { error: detErr } = await supabase
                .from("case_details")
                .insert({
                    case_id: id,
                    participant_id: myParticipant.id,
                    details: detailInput,
                })
            if (detErr) throw new Error(detErr.message)
            // Add new detail to state
            const newDetails = [
                ...details,
                { case_id: id, participant_id: myParticipant.id, details: detailInput },
            ]
            setDetails(newDetails)
            setDetailInput("")

            // Check if both creator and invited have submitted details
            const creator = participants.find((p) => p.role === "creator")
            const invited = participants.find((p) => p.role === "invited")
            const creatorHasDetail = newDetails.some((d) => d.participant_id === creator?.id)
            const invitedHasDetail = newDetails.some((d) => d.participant_id === invited?.id)

            if (creatorHasDetail && invitedHasDetail && caseData.status === CaseStatus.WAITING) {
                console.log("🎯 Both participants have submitted details! Starting question generation...")

                // Update case status to 'waiting for prosecutor'
                const { error: updateErr } = await supabase
                    .from("cases")
                    .update({ status: CaseStatus.WAITING_FOR_PROSECUTOR })
                    .eq("id", id)
                if (updateErr) throw new Error(updateErr.message)
                setCaseData((prev: any) => ({ ...prev, status: CaseStatus.WAITING_FOR_PROSECUTOR }))

                // Trigger question generation webhook
                const webhookSuccess = await triggerQuestionGeneration(id)
                if (!webhookSuccess) {
                    console.error("⚠️ Question generation webhook failed, but case status was updated")
                }
            }
        } catch (err: any) {
            setError(err.message || "An error occurred.")
        } finally {
            setDetailSubmitting(false)
        }
    }

    const handleAnswerSubmitted = async (newAnswer: any) => {
        console.log("📝 New answer submitted:", newAnswer)

        // Önce local state'i güncelle
        setAnswers((prev) => [...prev, newAnswer])
        setAllAnswers((prev) => [...prev, newAnswer])

        // Tüm sorular cevaplanmış mı kontrol et (kısa delay ile veritabanına yazılmasını bekle)
        setTimeout(async () => {
            await checkAllQuestionsAnswered()
        }, 500) // Biraz daha uzun delay
    }

    if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow border-4" /></div>
    if (error) return <div className="text-center py-12 text-red-600 font-heading text-xl">{error}</div>
    if (!caseData) return <div className="text-center py-12 font-heading text-lg">Case not found.</div>

    return (
        <div className="max-w-5xl mx-auto py-12 space-y-8 dark:bg-background dark:border-border bg-background">
            
            {/* Courtroom Middle Row: Plaintiff, Case Board, Defendant */}
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 mb-8">
                {/* Plaintiff (Creator) */}
                <Card className="flex-1 flex flex-col items-center shadow-lg p-4 min-w-[220px]">
                    <Avatar className="mb-2">
                        <AvatarImage src={creatorParticipant?.avatar_url} />
                        <AvatarFallback>{creatorParticipant?.email?.[0]?.toUpperCase() || "C"}</AvatarFallback>
                    </Avatar>
                    <div className="font-heading text-base mb-1">{creatorParticipant?.email}</div>
                    <Badge>Plaintiff</Badge>
                    <div className="mt-3 w-full">
                        <div className="font-heading text-sm mb-1">Details</div>
                        <Card className="font-base text-muted-foreground min-h-[40px] p-2">
                            {creatorDetail ? creatorDetail.details : <span className="italic text-muted-foreground">No details yet.</span>}
                        </Card>
                    </div>
                </Card>

                {/* Case Board (center) */}
                <Card className="flex-1 flex flex-col items-center justify-center shadow-lg p-6 min-w-[260px] max-w-md mx-auto">
                    <div className="font-heading text-2xl mb-2">{caseData.title}</div>
                    <div className="font-base text-lg mb-2">{caseData.description}</div>
                    <div className="mb-2"><span className="font-heading">Status:</span> <Badge variant="secondary">{caseData.status.replaceAll("_", " ")}</Badge></div>
                    <div className="mb-2"><span className="font-heading">Created:</span> {new Date(caseData.created_at).toLocaleString()}</div>
                </Card>

                {/* Defendant (Invited) */}
                <Card className="flex-1 flex flex-col items-center shadow-lg p-4 min-w-[220px]">
                    <Avatar className="mb-2">
                        <AvatarImage src={invitedParticipant?.avatar_url} />
                        <AvatarFallback>{invitedParticipant?.email?.[0]?.toUpperCase() || "D"}</AvatarFallback>
                    </Avatar>
                    <div className="font-heading text-base mb-1">{invitedParticipant?.email}</div>
                    <Badge variant="secondary">Defendant</Badge>
                    <div className="mt-3 w-full">
                        <div className="font-heading text-sm mb-1">Details</div>
                        {invitedParticipant?.id === myParticipant?.id && !hasWrittenDetail ? (
                            <div className="space-y-2">
                                <textarea
                                    className="w-full h-24 mb-2 p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={detailInput}
                                    onChange={(e) => setDetailInput(e.target.value)}
                                    placeholder="Write your side of the story..."
                                    disabled={detailSubmitting}
                                />
                                <Button
                                    onClick={handleSubmitDetail}
                                    className="w-full"
                                    disabled={detailSubmitting || !detailInput}
                                    aria-busy={detailSubmitting}
                                >
                                    Submit Your Details
                                </Button>
                            </div>
                        ) : (
                            <Card className="font-base text-muted-foreground min-h-[40px] p-2">
                                {invitedDetail ? invitedDetail.details : <span className="italic text-muted-foreground">No details yet.</span>}
                            </Card>
                        )}
                    </div>
                </Card>
            </div>

            {/* AI Questions Section (bottom, full width) */}
            <Card className="shadow-lg">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="font-heading text-2xl">AI Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    {myParticipant ? (
                        <CaseQuestionAnswer
                            questions={questions}
                            answers={answers}
                            participantId={myParticipant.id}
                            onAnswerSubmitted={handleAnswerSubmitted}
                        />
                    ) : (
                        <div className="text-muted-foreground italic">You are not a participant for this case.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
