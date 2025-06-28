import { NextRequest, NextResponse } from "next/server";
import { process } from "@/lib/analyzeService";

export async function POST(req: NextRequest) {
    try {
        const { caseId } = await req.json();
        if (!caseId) {
            return NextResponse.json({ success: false, error: "Missing caseId" }, { status: 400 });
        }
        const result = await process(caseId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
} 