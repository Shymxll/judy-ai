import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
    caseData: any
}

export const CaseCourtroomBoard: React.FC<Props> = ({
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
    caseData,
}) => (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 mb-8">
        {/* Plaintiff (Creator) */}
        <Card className="flex-1 flex flex-col items-center shadow-lg p-4 min-w-[220px]">
            <Avatar className="mb-2">
                <AvatarImage src={creatorParticipant?.avatar_url} />
                <AvatarFallback>{creatorParticipant?.email?.[0]?.toUpperCase() || "C"}</AvatarFallback>
            </Avatar>
            <div className="font-heading text-base mb-1">{creatorParticipant?.email}</div>
            <Badge>Plaintiff</Badge>
            <div className="mt-3 w-full">
                <div className="font-heading text-sm mb-1">Details</div>
                <Card className="font-base text-muted-foreground min-h-[40px] p-2">
                    {creatorDetail ? creatorDetail.details : <span className="italic text-muted-foreground">No details yet.</span>}
                </Card>
            </div>
        </Card>
        {/* Case Board (center) */}
        <Card className="flex-1 flex flex-col items-center justify-center shadow-lg p-6 min-w-[260px] max-w-md mx-auto">
            <div className="font-heading text-2xl mb-2">{caseData.title}</div>
            <div className="font-base text-lg mb-2">{caseData.description}</div>
            <div className="mb-2"><span className="font-heading">Status:</span> <Badge variant="secondary">{caseData.status.replaceAll("_", " ")}</Badge></div>
            <div className="mb-2"><span className="font-heading">Created:</span> {new Date(caseData.created_at).toLocaleString()}</div>
        </Card>
        {/* Defendant (Invited) */}
        <Card className="flex-1 flex flex-col items-center shadow-lg p-4 min-w-[220px]">
            <Avatar className="mb-2">
                <AvatarImage src={invitedParticipant?.avatar_url} />
                <AvatarFallback>{invitedParticipant?.email?.[0]?.toUpperCase() || "D"}</AvatarFallback>
            </Avatar>
            <div className="font-heading text-base mb-1">{invitedParticipant?.email}</div>
            <Badge variant="secondary">Defendant</Badge>
            <div className="mt-3 w-full">
                <div className="font-heading text-sm mb-1">Details</div>
                {invitedParticipant?.id === myParticipant?.id && !hasWrittenDetail ? (
                    <div className="space-y-2">
                        <textarea
                            className="w-full h-24 mb-2 p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={detailInput}
                            onChange={e => setDetailInput(e.target.value)}
                            placeholder="Write your side of the story..."
                            disabled={detailSubmitting}
                        />
                        <Button
                            onClick={handleSubmitDetail}
                            className="w-full"
                            disabled={detailSubmitting || !detailInput}
                            aria-busy={detailSubmitting}
                        >
                            Submit Your Details
                        </Button>
                    </div>
                ) : (
                    <Card className="font-base text-muted-foreground min-h-[40px] p-2">
                        {invitedDetail ? invitedDetail.details : <span className="italic text-muted-foreground">No details yet.</span>}
                    </Card>
                )}
            </div>
        </Card>
    </div>
) 