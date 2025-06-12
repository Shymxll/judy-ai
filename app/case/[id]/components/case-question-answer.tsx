"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface CaseQuestionAnswerProps {
    questions: any[]
    answers: any[]
    participantId: string
    onAnswerSubmitted: (newAnswer: any) => void
}

export function CaseQuestionAnswer({ questions, answers, participantId, onAnswerSubmitted }: CaseQuestionAnswerProps) {
    const [answerInputs, setAnswerInputs] = useState<{ [questionId: string]: string }>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleAnswerChange = (qid: string, value: string) => {
        setAnswerInputs((prev) => ({ ...prev, [qid]: value }))
    }

    const handleSubmitAnswer = async (qid: string) => {
        if (!participantId) return
        setSubmitting(true)
        setError("")
        try {
            const answer = answerInputs[qid]
            if (!answer) return
            const { error: ansErr } = await supabase
                .from("case_answers")
                .insert({
                    question_id: qid,
                    participant_id: participantId,
                    answer,
                })
            if (ansErr) throw new Error(ansErr.message)
            onAnswerSubmitted({ question_id: qid, answer })
            setAnswerInputs((prev) => ({ ...prev, [qid]: "" }))
        } catch (err: any) {
            setError(err.message || "An error occurred.")
        } finally {
            setSubmitting(false)
        }
    }

    if (questions.length === 0) {
        return <div className="font-base text-gray-500">No questions assigned to you yet.</div>
    }

    return (
        <div className="space-y-4">
            {error && <div className="text-red-600 font-base" role="alert">{error}</div>}
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
                                ) : (
                                    <div className="space-y-2">
                                        <textarea
                                            className="neobrutalism-input w-full h-24 mb-2 border-2 border-border rounded-base"
                                            value={answerInputs[q.id] || ""}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            disabled={submitting}
                                            placeholder="Type your answer here..."
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
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
} 