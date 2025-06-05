"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
    user: User | null
    session: Session | null
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        const currentSession = supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setUser(data.session?.user ?? null)
        })
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
        })
        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
    }

    return (
        <AuthContext.Provider value={{ user, session, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useSupabaseAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider")
    return context
} 