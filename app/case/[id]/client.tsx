"use client"

import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function CaseDetailPage({ params }: { params: { id: string } }) {
    const { user } = useSupabaseAuth()
    const { id } = params
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
        const fetchData = async () => {
            setLoading(true)
            setError("")
            try {
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
                const { data: qs, error: qErr } = await supabase
                    .from("case_questions")
                    .select("*")
                    .eq("case_id", id)
                if (qErr) throw new Error(qErr.message)
                setQuestions(qs || [])
                // Answers
                if (myParticipant) {
                    const { data: ans, error: aErr } = await supabase
                        .from("case_answers")
                        .select("*")
                        .in("question_id", (qs || []).map((q: any) => q.id))
                        .eq("participant_id", myParticipant.id)
                    if (aErr) throw new Error(aErr.message)
                    setAnswers(ans || [])
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
        if (id && user) fetchData()
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
            setDetails((prev) => [...prev, { case_id: id, participant_id: myParticipant.id, details: detailInput }])
            setDetailInput("")
        } catch (err: any) {
            setError(err.message || "An error occurred.")
        } finally {
            setDetailSubmitting(false)
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow border-4" /></div>
    if (error) return <div className="text-center py-12 text-red-600 font-heading text-xl">{error}</div>
    if (!caseData) return <div className="text-center py-12 font-heading text-lg">Case not found.</div>

    return (
        <div className="max-w-3xl mx-auto py-12 space-y-8">
            <div className="neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg p-0">
                <CardHeader className="bg-yellow/30 border-b-4 border-border rounded-t-base">
                    <CardTitle className="font-heading text-3xl">{caseData.title}</CardTitle>
                    <CardDescription className="font-base text-lg">{caseData.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="mb-2">
                        <span className="font-heading text-lg">Status:</span> <Badge>{caseData.status}</Badge>
                    </div>
                    <div>
                        <span className="font-heading text-lg">Created:</span> {new Date(caseData.created_at).toLocaleString()}
                    </div>
                </CardContent>
            </div>

            <div className="neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg">
                <CardHeader className="bg-yellow/30 border-b-4 border-border rounded-t-base">
                    <CardTitle className="font-heading text-2xl">Participants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {participants.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 bg-white border-2 border-border rounded-base shadow-sm">
                                <Avatar>
                                    <AvatarImage src={p.avatar_url} />
                                    <AvatarFallback>{p.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-heading text-base">{p.email}</div>
                                    <Badge variant={p.role === "creator" ? "default" : "secondary"}>{p.role}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </div>

            <div className="neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg">
                <CardHeader className="bg-yellow/30 border-b-4 border-border rounded-t-base">
                    <CardTitle className="font-heading text-2xl">Case Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        {/* Creator'ın detayı */}
                        {creatorParticipant && (
                            <Card className="border-2 border-border bg-white">
                                <CardHeader>
                                    <CardTitle className="font-heading text-lg">{creatorParticipant.email} <Badge className="ml-2">creator</Badge></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-base text-gray-700 min-h-[40px]">
                                        {creatorDetail ? creatorDetail.details : <span className="italic text-gray-400">No details yet.</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {/* Invited'ın detayı veya formu */}
                        {invitedParticipant && (
                            <Card className="border-2 border-border bg-white">
                                <CardHeader>
                                    <CardTitle className="font-heading text-lg">{invitedParticipant.email} <Badge className="ml-2">invited</Badge></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {invitedParticipant.id === myParticipant?.id && !hasWrittenDetail ? (
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
                                        <div className="font-base text-gray-700 min-h-[40px]">
                                            {invitedDetail ? invitedDetail.details : <span className="italic text-gray-400">No details yet.</span>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </div>

            <div className="neobrutalism-card border-4 border-border bg-yellow/10 shadow-lg">
                <CardHeader className="bg-yellow/30 border-b-4 border-border rounded-t-base">
                    <CardTitle className="font-heading text-2xl">AI Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    {questions.length === 0 && <div className="font-base text-gray-500">No questions yet.</div>}
                    <Accordion type="multiple" className="w-full">
                        {questions.map((q) => {
                            const answeredObj = answers.find((a) => a.question_id === q.id)
                            return (
                                <AccordionItem key={q.id} value={q.id} className="border-2 border-border rounded-base mb-2 bg-white">
                                    <AccordionTrigger className="font-heading text-lg px-4 py-2">{q.question}</AccordionTrigger>
                                    <AccordionContent>
                                        {answeredObj ? (
                                            <Card className="bg-green-50 border-green-200 border-2">
                                                <CardContent>
                                                    <div className="text-base font-base">{answeredObj.answer}</div>
                                                </CardContent>
                                            </Card>
                                        ) : myParticipant ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    className="neobrutalism-input w-full h-24 mb-2 border-2 border-border rounded-base"
                                                    value={answerInputs[q.id] || ""}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    disabled={submitting}
                                                />
                                                <Button
                                                    onClick={() => handleSubmitAnswer(q.id)}
                                                    className="neobrutalism-button bg-green font-heading"
                                                    disabled={submitting || !answerInputs[q.id]}
                                                    aria-busy={submitting}
                                                >
                                                    Submit Answer
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 italic">You are not a participant for this case.</div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </CardContent>
            </div>
        </div>
    )
}
