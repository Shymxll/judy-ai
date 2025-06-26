import React from "react"

type Props = {
    winnerParticipant: { email?: string } | null
    winnerLaw: { title?: string; text?: string } | null
}

export const CaseWinnerLaw: React.FC<Props> = ({ winnerParticipant, winnerLaw }) => {
    if (!winnerParticipant || !winnerLaw) return null
    return (
        <div className="mb-8" tabIndex={0} aria-label="Case Winner and Law" role="region">
            <div className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950 shadow-lg rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl text-yellow-500" aria-label="Winner">🏆</span>
                    <span className="text-xl font-heading">Winner: <span className="text-green-700 dark:text-green-300">{winnerParticipant.email || "Participant"}</span></span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg" aria-label="Relevant Law">⚖️</span>
                    <span className="font-semibold">Relevant Law:</span>
                    <span className="text-base font-heading">{winnerLaw.title}</span>
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                    {winnerLaw.text}
                </div>
            </div>
        </div>
    )
} 