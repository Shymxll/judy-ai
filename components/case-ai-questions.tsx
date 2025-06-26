import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CaseQuestionAnswer } from "@/app/case/[id]/components/case-question-answer"

type Props = {
    myParticipant: any
    questions: any[]
    answers: any[]
    participantId: string
    onAnswerSubmitted: (answer: any) => void
}

export const CaseAIQuestions: React.FC<Props> = ({ myParticipant, questions, answers, participantId, onAnswerSubmitted }) => (
    <Card className="shadow-lg">
        <CardHeader className="bg-muted/50">
            <CardTitle className="font-heading text-2xl">AI Questions</CardTitle>
        </CardHeader>
        <CardContent>
            {myParticipant ? (
                <CaseQuestionAnswer
                    questions={questions}
                    answers={answers}
                    participantId={participantId}
                    onAnswerSubmitted={onAnswerSubmitted}
                />
            ) : (
                <div className="text-muted-foreground italic">You are not a participant for this case.</div>
            )}
        </CardContent>
    </Card>
) 