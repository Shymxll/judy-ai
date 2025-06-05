"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"

export default function CaseDetailPage(
    { params }: { params: { id: string } }
) {
    const { user } = useSupabaseAuth()
    const { id } = params
    const [caseData, setCaseData] = useState<any>(null)
    const [participants, setParticipants] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [answers, setAnswers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [answerInputs, setAnswerInputs] = useState<{ [questionId: string]: string }>({})
    const [submitting, setSubmitting] = useState(false)

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

    if (loading) return <div className="text-center py-12 text-xl">Loading...</div>
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>
    if (!caseData) return <div className="text-center py-12">Case not found.</div>

    return (
        <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-4xl font-heading mb-4">{caseData.title}</h1>
            <p className="mb-6 text-lg text-foreground/80">{caseData.description}</p>
            <div className="mb-8">
                <h2 className="text-2xl font-heading mb-2">Participants</h2>
                <ul className="list-disc ml-6">
                    {participants.map((p) => (
                        <li key={p.id} className="mb-1">
                            {p.email} <span className="text-xs text-gray-500">({p.role})</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-8">
                <h2 className="text-2xl font-heading mb-4">AI Questions</h2>
                {questions.length === 0 && <div>No questions yet.</div>}
                {unanswered.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-heading mb-2">Answer the following questions:</h3>
                        {unanswered.map((q) => (
                            <div key={q.id} className="mb-4">
                                <div className="font-base mb-2">{q.question}</div>
                                <textarea
                                    className="neobrutalism-input w-full h-24 mb-2"
                                    value={answerInputs[q.id] || ""}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    disabled={submitting}
                                />
                                <Button
                                    onClick={() => handleSubmitAnswer(q.id)}
                                    className="neobrutalism-button bg-green"
                                    disabled={submitting || !answerInputs[q.id]}
                                    aria-busy={submitting}
                                >
                                    Submit Answer
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                {answered.length > 0 && (
                    <div>
                        <h3 className="text-lg font-heading mb-2">Your Answers:</h3>
                        {answered.map((q) => {
                            const a = answers.find((ans) => ans.question_id === q.id)
                            return (
                                <div key={q.id} className="mb-4">
                                    <div className="font-base mb-1">{q.question}</div>
                                    <div className="bg-gray-100 p-3 rounded-md border text-base">{a?.answer}</div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
