"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabaseClient"
import { FaEye, FaGavel, FaUser, FaCalendar } from "react-icons/fa"

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

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "Pending Friend Response":
      case "waiting":
        return "secondary"
      case "AI Analysis Complete":
      case "finished":
        return "default"
      case "Waiting for AI Analysis":
      case "evaluating":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <p className="text-xl mb-4">You must be logged in to see your cases.</p>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading cases...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto border-destructive">
        <CardContent className="text-center py-12">
          <p className="text-destructive text-xl">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {cases.map((case_) => (
        <Card key={case_.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-heading mb-2">{case_.title}</CardTitle>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FaCalendar className="text-sm" />
                    Case #{case_.id.slice(0, 8)}
                  </span>
                  <span>•</span>
                  <span>Created {new Date(case_.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge variant={getStatusVariant(case_.status)} className="ml-4">
                {case_.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FaUser className="text-sm" />
              <span className="font-medium">Friend:</span>
              <span>{case_.friendEmail || "-"}</span>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Link href={`/case/${case_.id}`}>
                <Button variant="default" size="sm" className="flex items-center gap-2">
                  <FaEye className="text-sm" />
                  View Details
                </Button>
              </Link>
              {case_.lawId && (
                <Link href={`/law/${case_.lawId}`}>
                  <Button variant="secondary" size="sm" className="flex items-center gap-2">
                    <FaGavel className="text-sm" />
                    View Law
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {cases.length === 0 && (
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12 space-y-4">
            <h3 className="text-2xl font-heading">No cases yet</h3>
            <p className="text-lg text-muted-foreground">Start your first case to see it here</p>
            <Link href="/start-case">
              <Button size="lg">Start a Case</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
