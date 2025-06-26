import { FaClock, FaUserTie, FaQuestion, FaSearch, FaCheck } from "react-icons/fa"

export enum CaseStatus {
    WAITING = "waiting",
    WAITING_FOR_PROSECUTOR = "waiting_for_prosecutor",
    WAITING_FOR_JUDGE = "waiting_for_judge",
    WAITING_FOR_COURT = "waiting_for_court",
    WAITING_FOR_EXECUTION = "waiting_for_execution",
    WAITING_FOR_ANSWER = "waiting_for_answer",
    WAITING_FOR_ANALYSIS = "waiting_for_analysis",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DELETED = "deleted",
    CLOSED = "closed",
}

export interface Case_Steps_For_Status {
    [key: string]: {
        id: number;
        title: string;
        description: string;
        icon: React.ElementType;
    }
}

export const Case_Steps_For_Status: Case_Steps_For_Status = {
    [CaseStatus.WAITING]: {
        id: 1,
        title: "Waiting",
        description: "Waiting for the case to start",
        icon: FaClock,
    },
    [CaseStatus.WAITING_FOR_PROSECUTOR]: {
        id: 2,
        title: "Waiting for Prosecutor",
        description: "Waiting for the prosecutor to start",
        icon: FaUserTie,
    },
    [CaseStatus.WAITING_FOR_ANSWER]: {
        id: 3,
        title: "Waiting for Answer",
        description: "Waiting for the answer to the question",
        icon: FaQuestion,
    },
    [CaseStatus.WAITING_FOR_ANALYSIS]: {
        id: 4,
        title: "Waiting for Analysis",
        description: "Waiting for the analysis to be completed",
        icon: FaSearch,
    },
    [CaseStatus.COMPLETED]: {
        id: 5,
        title: "Completed",
        description: "The case is completed",
        icon: FaCheck,
    },
}