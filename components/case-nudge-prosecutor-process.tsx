import React from "react"

type Props = {
    onNudge: () => void
    loading: boolean
}

export const CaseNudgeProsecutorProcess: React.FC<Props> = ({ onNudge, loading }) => (
    <button
        className="mb-4 px-4 py-2 rounded bg-yellow-600 text-white font-heading hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onClick={onNudge}
        tabIndex={0}
        aria-label="Savcıyı Dürt (İşlem Başlat)"
        disabled={loading}
        aria-busy={loading}
    >
        {loading ? "İstek gönderiliyor..." : "Savcıyı Dürt (İşlem Başlat)"}
    </button>
) 