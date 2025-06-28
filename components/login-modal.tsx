"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { supabase } from "@/lib/supabaseClient"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "" })
  }

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await axios.post("/api/login", { email, password })
      const data = res.data
      if (data.error) throw new Error(data.error || "Login failed")
      if (data.session) {
        localStorage.setItem("supabaseSession", JSON.stringify(data.session))
        await supabase.auth.signInWithPassword({ email, password })
      }
      return data
    },
    onSuccess: () => {
      resetForm()
      onClose()
      router.push("/my-cases")
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const res = await axios.post("/api/register", { name, email, password })
      const data = res.data
      if (data.error) throw new Error(data.error || "Register failed")
      if (data.session) {
        localStorage.setItem("supabaseSession", JSON.stringify(data.session))
        await supabase.auth.signInWithPassword({ email, password })
      }
      return data
    },
    onSuccess: () => {
      resetForm()
      onClose()
      router.push("/my-cases")
    },
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      loginMutation.mutate({ email: formData.email, password: formData.password })
    } else {
      registerMutation.mutate({ name: formData.name, email: formData.email, password: formData.password })
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending
  const errorMsg = loginMutation.error?.message || registerMutation.error?.message || ""

  return (
    <div
      className="fixed inset-0 bg-black/40  z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
      onClick={handleOverlayClick}
      tabIndex={0}
      aria-label="Login/Register Modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#f5f1eb] rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200 border border-[#e6dfd4]">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#e6dfd4] rounded-full transition-colors duration-200 text-[#8b6f47] hover:text-[#6b5537]"
          aria-label="Close modal"
          variant="ghost"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[#4a3728] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-[#8b6f47] text-sm">
            {isLogin ? "Sign in to access your cases" : "Join Judy to manage your legal cases"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" aria-label={isLogin ? "Login form" : "Register form"}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4a3728]" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border border-[#d4c4a8] rounded-lg focus:ring-2 focus:ring-[#8b6f47] focus:border-transparent transition-all duration-200 outline-none bg-white/80"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                aria-label="Name"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4a3728]" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 border border-[#d4c4a8] rounded-lg focus:ring-2 focus:ring-[#8b6f47] focus:border-transparent transition-all duration-200 outline-none bg-white/80"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              aria-label="Email address"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4a3728]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 pr-12 border border-[#d4c4a8] rounded-lg focus:ring-2 focus:ring-[#8b6f47] focus:border-transparent transition-all duration-200 outline-none bg-white/80"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                aria-label="Password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6f47] hover:text-[#6b5537] transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert" aria-live="assertive">
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8b6f47] to-[#a0825c] hover:from-[#6b5537] hover:to-[#805d42] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </div>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#8b6f47] text-sm mb-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            onClick={() => {
              setIsLogin(!isLogin)
              resetForm()
            }}
            className="text-[#8b6f47] hover:text-[#6b5537] font-medium text-sm underline decoration-2 underline-offset-4 transition-colors duration-200"
            variant="link"
            aria-label={isLogin ? "Switch to register" : "Switch to login"}
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </Button>
        </div>
      </div>
    </div>
  )
}