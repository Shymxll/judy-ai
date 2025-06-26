import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
    creatorParticipant: any
    invitedParticipant: any
    creatorDetail: any
    invitedDetail: any
    myParticipant: any
    hasWrittenDetail: boolean
    detailInput: string
    setDetailInput: (v: string) => void
    handleSubmitDetail: () => void
    detailSubmitting: boolean
}

export const CaseDetailsOnlyBoard: React.FC<Props> = ({
    creatorParticipant,
    invitedParticipant,
    creatorDetail,
    invitedDetail,
    myParticipant,
    hasWrittenDetail,
    detailInput,
    setDetailInput,
    handleSubmitDetail,
    detailSubmitting,
}) => {
    // Determine which side is the current user
    const isCreator = myParticipant?.id === creatorParticipant?.id
    const isInvited = myParticipant?.id === invitedParticipant?.id

    return (
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full">
            {/* Plaintiff (Creator) Details */}
            <Card className="flex-1 p-6 min-w-[220px] max-w-lg mx-auto">
                <div className="font-heading text-lg mb-2 text-center">Plaintiff Details</div>
                {isCreator && !hasWrittenDetail ? (
                    <div className="space-y-2">
                        <textarea
                            className="w-full h-48 mb-2 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                            value={detailInput}
                            onChange={e => setDetailInput(e.target.value)}
                            placeholder="Write your side of the story..."
                            disabled={detailSubmitting}
                            aria-label="Your details"
                        />
                        <Button
                            onClick={handleSubmitDetail}
                            className="w-full py-3 text-lg"
                            disabled={detailSubmitting || !detailInput}
                            aria-busy={detailSubmitting}
                        >
                            Submit Your Details
                        </Button>
                    </div>
                ) : (
                    <div className="font-base text-muted-foreground min-h-[40px] p-2">
                        {creatorDetail ? creatorDetail.details : <span className="italic text-muted-foreground">No details yet.</span>}
                    </div>
                )}
            </Card>
            {/* Defendant (Invited) Details */}
            <Card className="flex-1 p-6 min-w-[220px] max-w-lg mx-auto">
                <div className="font-heading text-lg mb-2 text-center">Defendant Details</div>
                {isInvited && !hasWrittenDetail ? (
                    <div className="space-y-2">
                        <textarea
                            className="w-full h-48 mb-2 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                            value={detailInput}
                            onChange={e => setDetailInput(e.target.value)}
                            placeholder="Write your side of the story..."
                            disabled={detailSubmitting}
                            aria-label="Your details"
                        />
                        <Button
                            onClick={handleSubmitDetail}
                            className="w-full py-3 text-lg"
                            disabled={detailSubmitting || !detailInput}
                            aria-busy={detailSubmitting}
                        >
                            Submit Your Details
                        </Button>
                    </div>
                ) : (
                    <div className="font-base text-muted-foreground min-h-[40px] p-2">
                        {invitedDetail ? invitedDetail.details : <span className="italic text-muted-foreground">No details yet.</span>}
                    </div>
                )}
            </Card>
        </div>
    )
} 