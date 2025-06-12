/**
 * Webhook utilities for case management
 */

const QUESTION_GENERATION_WEBHOOK = "https://n8n-postgre.avasu.org/webhook/45ae7aa4-3436-4a00-816e-07ff8d985853"

/**
 * Triggers question generation for a case
 * @param caseId - The ID of the case to generate questions for
 * @returns Promise<boolean> - Success status
 */
export const triggerQuestionGeneration = async (caseId: string): Promise<boolean> => {
    try {
        console.log(`🔥 Triggering question generation for case: ${caseId}`)

        const response = await fetch(`${QUESTION_GENERATION_WEBHOOK}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            console.error(`❌ Question generation webhook failed: ${response.status} ${response.statusText}`)
            return false
        }

        const result = await response.text()
        console.log(`✅ Question generation triggered successfully:`, result)

        return true
    } catch (error: any) {
        console.error(`❌ Error triggering question generation:`, error.message)
        return false
    }
} 