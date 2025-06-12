"use client"

import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabaseClient"
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
    const [answers, setAnswers] = useState<any[]>([])
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
                // Questions
                let qs: any[] = []
                let qErr = null
                if (myParticipant?.id) {
                    const result = await supabase
                        .from("case_questions")
                        .select("*")
                        .eq("case_id", id)
                        .eq("participant_id", myParticipant.id)
                    qs = result.data || []
                    qErr = result.error
                    if (qErr) throw new Error(qErr.message)
                    setQuestions(qs)
                } else {
                    setQuestions([])
                }
                // Answers
                if (myParticipant?.id && qs && qs.length > 0) {
                    const result = await supabase
                        .from("case_answers")
                        .select("*")
                        .in("question_id", qs.map((q: any) => q.id))
                        .eq("participant_id", myParticipant.id)
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
    }, [id, user, myParticipant?.id])

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
                // Update case status to 'waiting for prosecutor'
                const { error: updateErr } = await supabase
                    .from("cases")
                    .update({ status: CaseStatus.WAITING_FOR_PROSECUTOR })
                    .eq("id", id)
                if (updateErr) throw new Error(updateErr.message)
                setCaseData((prev: any) => ({ ...prev, status: CaseStatus.WAITING_FOR_PROSECUTOR }))
            }
        } catch (err: any) {
            setError(err.message || "An error occurred.")
        } finally {
            setDetailSubmitting(false)
        }
    }

    const handleAnswerSubmitted = (newAnswer: any) => {
        setAnswers((prev) => [...prev, newAnswer])
    }

    if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow border-4" /></div>
    if (error) return <div className="text-center py-12 text-red-600 font-heading text-xl">{error}</div>
    if (!caseData) return <div className="text-center py-12 font-heading text-lg">Case not found.</div>

    return (
        <div className="max-w-5xl mx-auto py-12 space-y-8">
            {/* Sacred Judge Judy at the Top */}
            <div className="flex justify-center items-center mb-10">
                <div className="flex flex-col items-center neobrutalism-card border-4 border-yellow-400 shadow-2xl px-8 py-6 min-w-[220px] bg-gradient-to-b from-yellow-100 via-yellow-50 to-white relative">
                    <span className="absolute -top-6"><GiCrown className="text-4xl text-yellow-400 drop-shadow-lg" aria-label="Crown" /></span>
                    <Avatar className="mb-2 ring-4 ring-yellow-300 ring-offset-2">
                        <AvatarImage src="/judge-judy-avatar.png" alt="Judge Judy" />
                        <AvatarFallback>J</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 mb-1">
                        <FaGavel className="text-2xl text-yellow-600" aria-label="Judge Gavel" />
                        <span className="font-heading text-2xl text-yellow-700">Judy</span>
                    </div>
                    <div className="font-heading text-lg text-yellow-700 italic mb-1">The Honorable Judge Judy</div>
                    <Badge className="bg-yellow-400 text-yellow-900 font-bold shadow">Sacred Judge</Badge>
                </div>
            </div>

            {/* Courtroom Middle Row: Plaintiff, Case Board, Defendant */}
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 mb-8">
                {/* Plaintiff (Creator) */}
                <div className="flex-1 flex flex-col items-center neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg p-4 min-w-[220px]">
                    <Avatar className="mb-2">
                        <AvatarImage src={creatorParticipant?.avatar_url} />
                        <AvatarFallback>{creatorParticipant?.email?.[0]?.toUpperCase() || "C"}</AvatarFallback>
                    </Avatar>
                    <div className="font-heading text-base mb-1">{creatorParticipant?.email}</div>
                    <Badge>Plaintiff</Badge>
                    <div className="mt-3 w-full">
                        <div className="font-heading text-sm mb-1">Details</div>
                        <div className="font-base text-gray-700 min-h-[40px] bg-white rounded-base border-2 border-border p-2">
                            {creatorDetail ? creatorDetail.details : <span className="italic text-gray-400">No details yet.</span>}
                        </div>
                    </div>
                </div>
                {/* Case Board (center) */}
                <div className="flex-1 flex flex-col items-center justify-center neobrutalism-card border-4 border-border bg-white shadow-lg p-6 min-w-[260px] max-w-md mx-auto">
                    <div className="font-heading text-2xl mb-2">{caseData.title}</div>
                    <div className="font-base text-lg mb-2">{caseData.description}</div>
                    <div className="mb-2"><span className="font-heading">Status:</span> <Badge>{caseData.status.replaceAll("_", " ")}</Badge></div>
                    <div className="mb-2"><span className="font-heading">Created:</span> {new Date(caseData.created_at).toLocaleString()}</div>
                </div>
                {/* Defendant (Invited) */}
                <div className="flex-1 flex flex-col items-center neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg p-4 min-w-[220px]">
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
                                    className="neobrutalism-input w-full h-24 mb-2 border-2 border-border rounded-base"
                                    value={detailInput}
                                    onChange={(e) => setDetailInput(e.target.value)}
                                    placeholder="Write your side of the story..."
                                    disabled={detailSubmitting}
                                />
                                <Button
                                    onClick={handleSubmitDetail}
                                    className="neobrutalism-button bg-green font-heading"
                                    disabled={detailSubmitting || !detailInput}
                                    aria-busy={detailSubmitting}
                                >
                                    Submit Your Details
                                </Button>
                            </div>
                        ) : (
                            <div className="font-base text-gray-700 min-h-[40px] bg-white rounded-base border-2 border-border p-2">
                                {invitedDetail ? invitedDetail.details : <span className="italic text-gray-400">No details yet.</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Questions Section (bottom, full width) */}
            <div className="neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg">
                <CardHeader className="bg-yellow/30 border-b-4 border-border rounded-t-base">
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
                        <div className="text-gray-400 italic">You are not a participant for this case.</div>
                    )}
                </CardContent>
            </div>
        </div>
    )
}
