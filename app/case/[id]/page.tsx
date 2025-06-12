import CaseDetailPage from "./client"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id || typeof id !== "string") {
        return <div className="text-center py-12 text-red-600 font-heading text-xl">Geçersiz veya eksik case ID</div>
    }
    return <CaseDetailPage params={{ id }} />
}

