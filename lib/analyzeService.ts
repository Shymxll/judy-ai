import { runSimpleAgent } from "./aiService";
import { getCaseById, getCaseDetails, getUsefullCaseData } from "./caseService";
import { systemPrompt, systemPromptForProsecutor } from "./prompts";
import { supabase } from "./supabaseClient";
import { CaseStatus } from "./types/case";

export async function analyze(caseId: string) {
    try {
        const caseData = await getUsefullCaseData();
        console.log(caseData);
        console.log("--------------------------------");
        const analysis = await runSimpleAgent({ systemPrompt: systemPrompt, userPrompt: "Analyze the following case data: " + JSON.stringify(caseData) });

        const analysisJson = JSON.parse(analysis || "{}");
        console.log(analysisJson);

        // 1. Önce laws tablosuna yeni yasa ekle
        const { proposed_law_article, justification } = analysisJson;
        let law_id: string | undefined = undefined;
        if (proposed_law_article && proposed_law_article.title && proposed_law_article.text) {
            const { data: lawData, error: lawError } = await supabase
                .from('laws')
                .insert([
                    {
                        case_id: caseId,
                        title: proposed_law_article.title,
                        text: proposed_law_article.text,
                        created_by_ai: true
                    }
                ])
                .select('id')
                .single();
            if (lawError) {
                console.error('Supabase law insert error:', lawError);
                return { success: false, error: "Failed to save law" };
            }
            law_id = lawData.id;
        }

        // 2. justification içindeki participant_id ve skorları al, law_id ile birlikte ekle
        const results = Object.entries(justification || {}).map(([participant_id, ai_score]) => ({
            case_id: caseId,
            participant_id,
            ai_score,
            law_id
        }));
        if (results.length > 0) {
            const { error } = await supabase.from('case_results').insert(results);
            if (error) {
                console.error('Supabase insert error:', error);
                return { success: false, error: "Failed to save results" };
            }
        }


        // 3. case için statusu "completed" yap
        const { error: caseError } = await supabase
            .from('cases')
            .update({ status: 'completed' })
            .eq('id', caseId);
        if (caseError) {
            console.error('Supabase case update error:', caseError);
            return { success: false, error: "Failed to update case status" };
        }


        return { analysisJson, law_id };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Internal server error" };
    }
};

export async function process(caseId: string) {
    try {
        console.log("caseId", caseId);
        const caseData = await getCaseById(caseId);

        //get case details
        const caseDetails = await getCaseDetails(caseId);
        console.log("caseDetails", caseDetails);

        console.log("--------------------------------");
        const analysis = await runSimpleAgent({ systemPrompt: systemPromptForProsecutor, userPrompt: "Analyze the following case data: " + JSON.stringify(caseDetails) });
        console.log("analysis", analysis);

        // --- New logic: Parse and insert questions ---
        let questionsJson: Record<string, string[]> = {};
        try {
            questionsJson = JSON.parse(analysis || '{}');
        } catch (parseError) {
            console.error('Failed to parse analysis as JSON:', parseError);
            return { success: false, error: 'Invalid analysis format' };
        }

        const questionsToInsert: any[] = [];
        for (const [participant_id, questions] of Object.entries(questionsJson)) {
            if (Array.isArray(questions)) {
                for (const question of questions) {
                    questionsToInsert.push({
                        participant_id,
                        case_id: caseId,
                        question,
                        created_by_ai: true,
                        created_at: new Date().toISOString(),
                    });
                }
            }
        }

        if (questionsToInsert.length > 0) {
            const { error: insertError } = await supabase.from('case_questions').insert(questionsToInsert);
            if (insertError) {
                console.error('Supabase insert error:', insertError);
                return { success: false, error: 'Failed to save questions' };
            }
        }


        //update case status to waiting for prosecutor
        const { error: caseError } = await supabase
            .from('cases')
            .update({ status: CaseStatus.WAITING_FOR_ANSWER })
            .eq('id', caseId);
        if (caseError) {
            console.error('Supabase case update error:', caseError);
            return { success: false, error: "Failed to update case status" };
        }

        return { success: true, questions: questionsToInsert };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Internal server error" };
    }
}