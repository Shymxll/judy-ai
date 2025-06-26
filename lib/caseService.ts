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

export async function fetchAllLaws() {
    const { data, error } = await supabase.from("laws").select("*").order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
}

export async function likeLaw(lawId: string, userId: string) {
    const { error } = await supabase.from("law_likes").upsert({ law_id: lawId, user_id: userId, type: "like" }, { onConflict: "law_id,user_id" })
    if (error) throw new Error(error.message)
}

export async function dislikeLaw(lawId: string, userId: string) {
    const { error } = await supabase.from("law_likes").upsert({ law_id: lawId, user_id: userId, type: "dislike" }, { onConflict: "law_id,user_id" })
    if (error) throw new Error(error.message)
}

export async function getLawLikes(lawId: string) {
    const { data, error } = await supabase.from("law_likes").select("type").eq("law_id", lawId)
    if (error) throw new Error(error.message)
    const fair = data?.filter((d: any) => d.type === "like").length || 0
    const unfair = data?.filter((d: any) => d.type === "dislike").length || 0
    return { fair, unfair }
}

export async function getUserLawLike(lawId: string, userId: string) {
    const { data, error } = await supabase.from("law_likes").select("type").eq("law_id", lawId).eq("user_id", userId).single()
    if (error && error.code !== "PGRST116") throw new Error(error.message)
    return data?.type || null
} 