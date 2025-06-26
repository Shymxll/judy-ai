import { supabase } from "@/lib/supabaseClient"

export async function fetchCaseById(id: string) {
    const { data, error } = await supabase.from("cases").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function fetchParticipants(caseId: string) {
    const { data, error } = await supabase.from("case_participants").select("*").eq("case_id", caseId)
    if (error) throw new Error(error.message)
    return data || []
}

export async function fetchQuestions(caseId: string) {
    const { data, error } = await supabase.from("case_questions").select("*").eq("case_id", caseId)
    if (error) throw new Error(error.message)
    return data || []
}

export async function fetchAnswers(questionIds: string[]) {
    if (!questionIds.length) return []
    const { data, error } = await supabase.from("case_answers").select("*").in("question_id", questionIds)
    if (error) throw new Error(error.message)
    return data || []
}

export async function insertAnswer({ question_id, participant_id, answer }: { question_id: string, participant_id: string, answer: string }) {
    const { error } = await supabase.from("case_answers").insert({ question_id, participant_id, answer })
    if (error) throw new Error(error.message)
}

export async function insertDetail({ case_id, participant_id, details }: { case_id: string, participant_id: string, details: string }) {
    const { error } = await supabase.from("case_details").insert({ case_id, participant_id, details })
    if (error) throw new Error(error.message)
}

export async function fetchCaseDetails(caseId: string) {
    const { data, error } = await supabase.from("case_details").select("*").eq("case_id", caseId)
    if (error) throw new Error(error.message)
    return data || []
}

export async function fetchCaseResults(caseId: string) {
    const { data, error } = await supabase.from("case_results").select("*").eq("case_id", caseId)
    if (error) throw new Error(error.message)
    return data || []
}

export async function fetchLawById(lawId: string) {
    const { data, error } = await supabase.from("laws").select("*").eq("id", lawId).single()
    if (error) throw new Error(error.message)
    return data
}

// Winner logic: returns {winnerResult, winnerParticipant, winnerLaw}
export async function fetchCaseResultsAndWinner(caseId: string) {
    const results = await fetchCaseResults(caseId)
    if (!results.length) return { winnerResult: null, winnerParticipant: null, winnerLaw: null }
    let winner = results[0]
    if (results.length > 1) {
        winner = results.reduce((prev: any, curr: any) => {
            const prevScore = typeof prev.ai_score === "object" ? prev.ai_score.score ?? 0 : prev.ai_score ?? 0
            const currScore = typeof curr.ai_score === "object" ? curr.ai_score.score ?? 0 : curr.ai_score ?? 0
            return currScore > prevScore ? curr : prev
        })
    }
    const { data: participant } = await supabase.from("case_participants").select("*").eq("id", winner.participant_id).single()
    const { data: law } = await supabase.from("laws").select("*").eq("id", winner.law_id).single()
    return { winnerResult: winner, winnerParticipant: participant, winnerLaw: law }
}

export async function updateCaseStatus(caseId: string, status: string) {
    const { error } = await supabase.from("cases").update({ status }).eq("id", caseId)
    if (error) throw new Error(error.message)
} 