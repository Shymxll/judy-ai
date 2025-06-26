import React from "react"

type Props = {
    onNudge: () => void
    loading: boolean
}

export const CaseNudgeProsecutor: React.FC<Props> = ({ onNudge, loading }) => (
    <button
        className="mb-4 px-4 py-2 rounded bg-yellow-500 text-white font-heading hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onClick={onNudge}
        tabIndex={0}
        aria-label="Savcıyı Dürt"
        disabled={loading}
        aria-busy={loading}
    >
        {loading ? "İstek gönderiliyor..." : "Savcıyı Dürt"}
    </button>
) 