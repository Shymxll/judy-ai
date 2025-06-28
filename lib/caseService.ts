import { supabase } from "@/lib/supabaseClient"
import { CaseStatus } from "./types/case"

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



export async function getWaitingForAnalysisCases() {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('status', 'waiting_for_analysis')
        .limit(1)
        .single();


    if (error) {
        throw error;
    }
    return data;
}

export async function getWaitingForProsecutorCases() {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('status', CaseStatus.WAITING_FOR_PROSECUTOR)
        .limit(1)
        .single();


    if (error) {
        throw error;
    }
    return data;
}

export async function getCaseById(caseId: string) {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

    if (error) {
        throw error;
    }
    return data;
}



export async function getUsefullCaseData() {
    const cases = await getWaitingForAnalysisCases();
    let caseDetails = [];
    let participant_1_questions_and_answers = [];
    let participant_2_questions_and_answers = [];

    if (cases) {
        const caseDetails = await getCaseDetails(cases.id);

        //first user 
        const participant_1 = caseDetails[0].participant_id;

        const participant_2 = caseDetails[1].participant_id;


        let participants_and_real_ids = []
        participants_and_real_ids.push({ participant_1: participant_1 });
        participants_and_real_ids.push({ participant_2: participant_2 });
        for (const detail of caseDetails) {
            participants_and_real_ids.push({ participant_id: detail.participant_id, real_id: detail.real_id });
        }



        console.log(participants_and_real_ids);

        //get questions and answers from case
        const questions = await getQuestions(cases.id, participant_1);

        for (const question of questions) {
            const answer = await getAnswer(question.id, participant_1);
            const question_and_answer = { question: question.question, answer: answer ? answer.answer : null };
            participant_1_questions_and_answers.push(question_and_answer);
        }

        //second user
        const questions_2 = await getQuestions(cases.id, participant_2);


        for (const question of questions_2) {
            const answer = await getAnswer(question.id, participant_2);
            const question_and_answer = { question: question.question, answer: answer ? answer.answer : null };
            participant_2_questions_and_answers.push(question_and_answer);
        }


        return { participants_and_real_ids, participant_1_questions_and_answers, participant_2_questions_and_answers, caseDetails };
    }
}

//get details from case
export async function getCaseDetails(caseId: string) {
    try {
        const { data, error } = await supabase
            .from('case_details')
            .select('*')
            .eq('case_id', caseId);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw error;
    }
}


// get questons and answers from case wit caseId
export async function getQuestions(caseId: string, participantId: string) {
    try {

        const { data, error } = await supabase
            .from('case_questions')
            .select('*')
            .eq('case_id', caseId)
            .eq('participant_id', participantId)

        if (error) {
            console.log("error");
            throw error;
        }
        return data;
    } catch (error) {
        console.log("error");
        throw error;
    }
}


// get answer from case_answers with question_id
export async function getAnswer(questionId: string, participantId: string) {
    const { data, error } = await supabase
        .from('case_answers')
        .select('*')
        .eq('question_id', questionId)
        .eq('participant_id', participantId)
        .maybeSingle();

    if (error) {
        throw error;
    }
    return data;
}


//get case_details with case_id
export async function getParticipantIdWithCaseId(caseId: string) {
    const { data, error } = await supabase
        .from('case_details')
        .select('participant_id')
        .eq('case_id', caseId)

    if (error) {
        throw error;
    }
    return data;
}




// get answer from case_answers with question_id