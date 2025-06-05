import CaseDetailPage from "./client"


export default async function Page(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    console.log(id)
    return <CaseDetailPage params={{ id }} />

}

