import React, { useState, useEffect } from "react"

type Props = {
    onNudge: () => void
    loading: boolean
}

export const CaseNudgeProsecutor: React.FC<Props> = ({ onNudge, loading }) => {
    const [showDurtGif, setShowDurtGif] = useState(false)

    const handleNudgeClick = () => {
        setShowDurtGif(true)
        onNudge()
    }

    // Dürt gif'i bittiğinde sleep gif'ine geri dön
    const handleDurtGifEnd = () => {
        setShowDurtGif(false)
    }

    return (
        <div className="flex flex-col items-center py-8">
            {/* GIF gösterimi */}
            <div className="mb-6">
                {showDurtGif ? (
                    <img
                        src="/assets/durt.gif"
                        alt="Dürtme animasyonu"
                        className="w-48 h-48 object-contain"
                        onLoad={(e) => {
                            // Gif'in süresini hesapla ve bittiğinde sleep gif'ine dön
                            const img = e.target as HTMLImageElement
                            // Genellikle dürt gif'i kısa olur, 2-3 saniye bekleyelim
                            setTimeout(() => {
                                handleDurtGifEnd()
                            }, 2500) // 2.5 saniye sonra sleep gif'ine dön
                        }}
                    />
                ) : (
                    <img
                        src="/assets/sleep.gif"
                        alt="Uyku animasyonu"
                        className="w-48 h-48 object-contain"
                        style={{ imageRendering: 'auto' }}
                    />
                )}
            </div>

            {/* Buton */}
            <button
                className="mb-4 px-4 py-2 rounded bg-yellow-500 text-white font-heading hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNudgeClick}
                tabIndex={0}
                aria-label="Nudge the Prosecutor"
                disabled={loading}
                aria-busy={loading}
            >
                {loading ? "Sending request..." : "Nudge the Prosecutor"}
            </button>
        </div>
    )
}