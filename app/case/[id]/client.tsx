"use client"

import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { triggerQuestionGeneration } from "@/lib/webhooks"
import { CaseStepProgress } from "@/components/case-step-progress"
import { CaseStatus } from "@/lib/types/case"
import { Backend } from "@/lib/backend"
import { useToast } from "@/hooks/use-toast"
import { CaseWinnerLaw } from "@/components/case-winner-law"
import { CaseCourtroomBoard } from "@/components/case-courtroom-board"
import { CaseAIQuestions } from "@/components/case-ai-questions"
import { CaseNudgeProsecutor } from "@/components/case-nudge-prosecutor"
import { CaseNudgeProsecutorProcess } from "@/components/case-nudge-prosecutor-process"
import {
    fetchCaseById,
    fetchParticipants,
    fetchQuestions,
    fetchAnswers,
    insertAnswer,
    insertDetail,
    fetchCaseDetails,
    fetchCaseResultsAndWinner,
    updateCaseStatus
} from "@/lib/caseService"
import { CaseDetailsOnlyBoard } from "@/components/case-details-only-board"
import { useRouter } from "next/navigation"

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
    const [caseResults, setCaseResults] = useState<any[]>([])
    const [winnerParticipant, setWinnerParticipant] = useState<any>(null)
    const [winnerLaw, setWinnerLaw] = useState<any>(null)
    const [selectedStep, setSelectedStep] = useState<CaseStatus | null>(null)
    const { toast } = useToast()
    const [analyzeLoading, setAnalyzeLoading] = useState(false)
    const [processLoading, setProcessLoading] = useState(false)
    const router = useRouter()
    // Kullanıcının participant kaydını bul
    const myParticipant = participants.find(
        (p) => p.user_id === user?.id || p.email === user?.email
    )

    // Tüm sorular cevaplanmış mı kontrol et
    const checkAllQuestionsAnswered = async () => {
        try {
            // Fresh data çek - state'e güvenme
            const freshParticipants = await fetchParticipants(id)
            const freshQuestions = await fetchQuestions(id)
            const freshAnswers = await fetchAnswers((freshQuestions || []).map((q: any) => q.id))

            // Her katılımcı için kontrol et
            let allCompleted = true
            for (const participant of freshParticipants || []) {
                const participantQuestions = (freshQuestions || []).filter(q => q.participant_id === participant.id)
                const participantAnswers = (freshAnswers || []).filter(a =>
                    participantQuestions.some(q => q.id === a.question_id)
                )
                const unansweredCount = participantQuestions.length - participantAnswers.length
                if (unansweredCount > 0) {
                    allCompleted = false
                    break
                }
            }
            if (!allCompleted) {
                return false
            }
            // Case status'unu güncelle
            if (caseData && caseData.status !== CaseStatus.WAITING_FOR_ANALYSIS) {
                await fetchCaseById(id) // Optionally refetch or update status here if needed
                setCaseData((prev: any) => ({ ...prev, status: CaseStatus.WAITING_FOR_ANALYSIS }))
                return true
            } else {
                return true
            }
        } catch (err: any) {
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
                // Case
                const caseRow = await fetchCaseById(id)
                setCaseData(caseRow)

                // Participants
                const parts = await fetchParticipants(id)
                setParticipants(parts || [])

                // Tüm katılımcıların sorularını getir
                const allQs = await fetchQuestions(id)
                setAllQuestions(allQs || [])

                // Tüm katılımcıların cevaplarını getir
                if (allQs && allQs.length > 0) {
                    const allAs = await fetchAnswers(allQs.map((q: any) => q.id))
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
                    const ans = (await fetchAnswers(qs.map((q: any) => q.id))).filter((a: any) => a.participant_id === myPart.id)
                    setAnswers(ans)
                } else {
                    setAnswers([])
                }

                // Details
                const dets = await fetchCaseDetails(id)
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

    // Fetch case results and winner law if completed
    useEffect(() => {
        const fetchResultsAndLaw = async () => {
            if (!id || caseData?.status !== CaseStatus.COMPLETED) return
            const { winnerParticipant, winnerLaw } = await fetchCaseResultsAndWinner(id)
            setWinnerParticipant(winnerParticipant)
            setWinnerLaw(winnerLaw)
        }
        fetchResultsAndLaw()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, caseData?.status])

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
            await insertAnswer({ question_id: qid, participant_id: myParticipant.id, answer })
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
            await insertDetail({ case_id: id, participant_id: myParticipant.id, details: detailInput })
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
                await updateCaseStatus(id, CaseStatus.WAITING_FOR_PROSECUTOR)
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

    // Step click handler: set selectedStep
    const handleStepClick = (status: CaseStatus) => {
        setSelectedStep(status)
    }

    // Back to current step handler
    const handleBackToCurrent = () => setSelectedStep(null)

    // Savcıyı Dürt (İşlem Başlat) handler for WAITING_FOR_PROSECUTOR
    const handleNudgeProsecutorProcess = async () => {
        setProcessLoading(true)
        try {
            const res = await fetch(`/api/analyze/process`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caseId: id })
            })

            
            const { success, error } = await res.json()
            if (success) {
                toast({
                    title: "İşlem başlatıldı!",
                    description: "Savcıya işlemi yaptı",
                    variant: "default",
                })
                router.refresh()
            } else {
                toast({
                    title: "Hata oluştu!",
                    description: error || "Savcıya istek gönderilemedi.",
                    variant: "destructive",
                })
            }
            toast({
                title: "Savcıya işlem başlatma isteği gönderildi!",
                description: "İşlem başlatıldı.",
                variant: "default",
            })

            router.refresh()
        } catch (err: any) {
            toast({
                title: "Hata oluştu!",
                description: err?.message || "Savcıya istek gönderilemedi.",
                variant: "destructive",
            })
        } finally {
            setProcessLoading(false)
        }
    }

    const handleNudgeAnalyzer = async () => {
        setAnalyzeLoading(true)
        try {
            const res = await fetch(`/api/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caseId: id })
            })
            const { success, error } = await res.json()
            if (success) {
                toast({
                    title: "İşlem başlatıldı!",
                    description: "Analiz işlemi başlatıldı.",
                    variant: "default",
                })
                router.refresh()
            } else {
                toast({
                    title: "Hata oluştu!",
                    description: error || "Analiz işlemi başlatılamadı.",
                    variant: "destructive",
                })
            }
            router.refresh()
        } catch (err: any) {
            toast({
                title: "Hata oluştu!",
                description: err?.message || "Analiz işlemi başlatılamadı.",
            })
        } finally {
            setAnalyzeLoading(false)
        }
    }


    if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow border-4" /></div>
    if (error) return <div className="text-center py-12 text-red-600 font-heading text-xl">{error}</div>
    if (!caseData) return <div className="text-center py-12 font-heading text-lg">Case not found.</div>

    // Render for WAITING step
    if (selectedStep === CaseStatus.WAITING || (!selectedStep && caseData && caseData.status === CaseStatus.WAITING)) {
        return (
            <div className="max-w-3xl mx-auto py-12">
                <CaseStepProgress
                    currentStatus={caseData.status}
                    onStepClick={handleStepClick}
                    disableNavigation={false}
                />
                <CaseDetailsOnlyBoard
                    creatorParticipant={creatorParticipant}
                    invitedParticipant={invitedParticipant}
                    creatorDetail={creatorDetail}
                    invitedDetail={invitedDetail}
                    myParticipant={myParticipant}
                    hasWrittenDetail={hasWrittenDetail}
                    detailInput={detailInput}
                    setDetailInput={setDetailInput}
                    handleSubmitDetail={handleSubmitDetail}
                    detailSubmitting={detailSubmitting}
                />
            </div>
        )
    }

    // Render for WAITING_FOR_ANSWER step
    if (selectedStep === CaseStatus.WAITING_FOR_ANSWER) {
        return (
            <div className="max-w-3xl mx-auto py-12 space-y-8">
                <CaseStepProgress
                    currentStatus={caseData.status}
                    onStepClick={handleStepClick}
                    disableNavigation={false}
                />
                <button
                    className="mb-4 px-4 py-2 rounded bg-primary text-white font-heading hover:bg-primary/80 focus:outline-none"
                    onClick={handleBackToCurrent}
                    tabIndex={0}
                    aria-label="Back to current step"
                >
                    ← Back to current step
                </button>
                <CaseAIQuestions
                    myParticipant={myParticipant}
                    questions={questions}
                    answers={answers}
                    participantId={myParticipant?.id}
                    onAnswerSubmitted={handleAnswerSubmitted}
                />
            </div>
        )
    }

    // Render for WAITING_FOR_ANALYSIS step
    if (selectedStep === CaseStatus.WAITING_FOR_ANALYSIS || (!selectedStep && caseData && caseData.status === CaseStatus.WAITING_FOR_ANALYSIS)) {
        return (
            <div className="max-w-3xl mx-auto py-12 space-y-8">
                <CaseStepProgress
                    currentStatus={caseData.status}
                    onStepClick={handleStepClick}
                    disableNavigation={false}
                />
                <CaseNudgeProsecutor
                    onNudge={handleNudgeAnalyzer}
                    loading={analyzeLoading}
                />
            </div>
        )
    }

    // Render for WAITING_FOR_PROSECUTOR step
    if (selectedStep === CaseStatus.WAITING_FOR_PROSECUTOR || (!selectedStep && caseData && caseData.status === CaseStatus.WAITING_FOR_PROSECUTOR)) {
        return (
            <div className="max-w-3xl mx-auto py-12 space-y-8">
                <CaseStepProgress
                    currentStatus={caseData.status}
                    onStepClick={handleStepClick}
                    disableNavigation={false}
                />
                <CaseNudgeProsecutorProcess
                    onNudge={handleNudgeProsecutorProcess}
                    loading={processLoading}
                />
            </div>
        )
    }

    // Main render
    return (
        <div className="max-w-5xl mx-auto py-12 space-y-8 dark:bg-background dark:border-border bg-background">
            {/* Step Progress Bar */}
            {caseData && (
                <CaseStepProgress
                    currentStatus={caseData.status}
                    onStepClick={handleStepClick}
                    disableNavigation={false}
                />
            )}
            {/* Winner & Law Section */}
            {caseData && caseData.status === CaseStatus.COMPLETED && (
                <CaseWinnerLaw
                    winnerParticipant={winnerParticipant}
                    winnerLaw={winnerLaw}
                />
            )}
            {/* Courtroom Board */}
            <CaseCourtroomBoard
                creatorParticipant={creatorParticipant}
                invitedParticipant={invitedParticipant}
                creatorDetail={creatorDetail}
                invitedDetail={invitedDetail}
                myParticipant={myParticipant}
                hasWrittenDetail={hasWrittenDetail}
                detailInput={detailInput}
                setDetailInput={setDetailInput}
                handleSubmitDetail={handleSubmitDetail}
                detailSubmitting={detailSubmitting}
                caseData={caseData}
            />
            {/* AI Questions Section */}
            <CaseAIQuestions
                myParticipant={myParticipant}
                questions={questions}
                answers={answers}
                participantId={myParticipant?.id}
                onAnswerSubmitted={handleAnswerSubmitted}
            />
        </div>
    )
}
