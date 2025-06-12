"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

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
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No questions assigned to you yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Accordion type="multiple" className="w-full space-y-4">
                {questions.map((q) => {
                    const answeredObj = answers.find((a) => a.question_id === q.id)
                    return (
                        <AccordionItem key={q.id} value={q.id} className="border rounded-lg">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-heading text-lg text-left">{q.question}</span>
                                    {answeredObj && (
                                        <Badge variant="default" className="ml-2 flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Answered
                                        </Badge>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                {answeredObj ? (
                                    <Card className="bg-green-50 border-green-200">
                                        <CardContent className="py-4">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-base">{answeredObj.answer}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Type your answer here..."
                                            value={answerInputs[q.id] || ""}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            disabled={submitting}
                                            className="min-h-[100px] resize-none"
                                        />
                                        <Button
                                            onClick={() => handleSubmitAnswer(q.id)}
                                            disabled={submitting || !answerInputs[q.id]}
                                            className="w-full sm:w-auto"
                                        >
                                            {submitting ? "Submitting..." : "Submit Answer"}
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