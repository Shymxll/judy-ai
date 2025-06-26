import React from "react"
import { Case_Steps_For_Status, CaseStatus } from "@/lib/types/case"

export type CaseStepProgressProps = {
    currentStatus: CaseStatus
    onStepClick?: (status: CaseStatus) => void
    disableNavigation?: boolean
}

const stepOrder = [
    CaseStatus.WAITING,
    CaseStatus.WAITING_FOR_PROSECUTOR,
    CaseStatus.WAITING_FOR_ANSWER,
    CaseStatus.WAITING_FOR_ANALYSIS,
    CaseStatus.COMPLETED,
]

export const CaseStepProgress: React.FC<CaseStepProgressProps> = ({ currentStatus, onStepClick, disableNavigation }) => {
    const currentIdx = stepOrder.indexOf(currentStatus)

    return (
        <nav aria-label="Case Progress" className="w-full flex justify-center mb-6">
            <ol className="flex items-center gap-0 md:gap-2 w-full max-w-3xl">
                {stepOrder.map((status, idx) => {
                    const step = Case_Steps_For_Status[status]
                    const isActive = idx === currentIdx
                    const isCompleted = idx < currentIdx
                    const isClickable = isCompleted && !disableNavigation
                    const Icon = step.icon
                    return (
                        <li key={status} className="flex-1 flex flex-col items-center group">
                            <button
                                type="button"
                                tabIndex={isClickable ? 0 : -1}
                                aria-current={isActive ? "step" : undefined}
                                aria-disabled={!isClickable}
                                onClick={() => isClickable && onStepClick && onStepClick(status)}
                                className={
                                    `flex flex-col items-center px-2 py-1 focus:outline-none ` +
                                    (isActive
                                        ? "text-primary font-bold"
                                        : isCompleted
                                            ? "text-green-600 hover:text-green-800 underline cursor-pointer"
                                            : "text-gray-400 cursor-not-allowed")
                                }
                                disabled={!isClickable}
                            >
                                <span className={`rounded-full border-2 w-8 h-8 flex items-center justify-center mb-1 ` +
                                    (isActive
                                        ? "border-primary bg-primary/10"
                                        : isCompleted
                                            ? "border-green-500 bg-green-100"
                                            : "border-gray-300 bg-gray-100")
                                }>
                                    <Icon className="text-lg" aria-hidden="true" />
                                </span>
                                <span className="text-xs font-heading text-center whitespace-nowrap">{step.title}</span>
                            </button>
                            {idx < stepOrder.length - 1 && (
                                <span className="w-full h-1 bg-gray-300 group-last:hidden" aria-hidden="true"></span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
} 