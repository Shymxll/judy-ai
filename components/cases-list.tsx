"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabaseClient"

type CaseListItem = {
  id: string
  title: string
  status: string
  created_at: string
  friendEmail?: string
  lawId?: string
}

export function CasesList() {
  const { user } = useSupabaseAuth()
  const [cases, setCases] = useState<CaseListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCases = async () => {
      if (!user) return
      setLoading(true)
      setError("")
      try {
        // Kullanıcıya ait participant kayıtlarını bul
        const { data: participants, error: partErr } = await supabase
          .from("case_participants")
          .select("id, case_id, email, role")
          .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        if (partErr) throw new Error(partErr.message)
        if (!participants || participants.length === 0) {
          setCases([])
          setLoading(false)
          return
        }
        const caseIds = participants.map((p: any) => p.case_id)
        // Case'leri çek
        const { data: casesData, error: casesErr } = await supabase
          .from("cases")
          .select("id, title, status, created_at")
          .in("id", caseIds)
          .order("created_at", { ascending: false })
        if (casesErr) throw new Error(casesErr.message)
        // Her case için friend email ve lawId'yi bul
        const enrichedCases = await Promise.all(
          (casesData || []).map(async (c: any) => {
            // Friend email: invited olan participant
            const friend = participants.find(
              (p: any) => p.case_id === c.id && p.role === "invited"
            )
            // LawId: laws tablosunda case_id eşleşen varsa
            const { data: law } = await supabase
              .from("laws")
              .select("id")
              .eq("case_id", c.id)
              .maybeSingle()
            return {
              id: c.id,
              title: c.title,
              status: c.status,
              created_at: c.created_at,
              friendEmail: friend?.email,
              lawId: law?.id,
            }
          })
        )
        setCases(enrichedCases)
      } catch (err: any) {
        setError(err.message || "An error occurred.")
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Friend Response":
      case "waiting":
        return "bg-yellow"
      case "AI Analysis Complete":
      case "finished":
        return "bg-green"
      case "Waiting for AI Analysis":
      case "evaluating":
        return "bg-blue"
      default:
        return "bg-secondary-background"
    }
  }

  if (!user) {
    return <div className="text-center py-12 text-xl">You must be logged in to see your cases.</div>
  }

  if (loading) {
    return <div className="text-center py-12 text-xl">Loading cases...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {cases.map((case_) => (
        <div key={case_.id} className="neobrutalism-card p-6 rounded-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-heading mb-2">{case_.title}</h3>
              <p className="text-base font-base text-foreground/70">
                Case #{case_.id.slice(0, 8)} • Created {new Date(case_.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 border-2 border-border rounded-md ${getStatusColor(case_.status)}`}>
              <span className="font-heading text-sm">{case_.status}</span>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-base">
              <span className="font-heading">Friend:</span> {case_.friendEmail || "-"}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href={`/case/${case_.id}`}>
              <Button className="neobrutalism-button bg-blue text-sm">View Details</Button>
            </Link>
            {case_.lawId && (
              <Link href={`/law/${case_.lawId}`}>
                <Button className="neobrutalism-button bg-green text-sm">View Law</Button>
              </Link>
            )}
          </div>
        </div>
      ))}
      {cases.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-heading mb-4">No cases yet</h3>
          <p className="text-lg font-base mb-6">Start your first case to see it here</p>
          <Link href="/start-case">
            <Button className="neobrutalism-button bg-yellow">Start a Case</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
