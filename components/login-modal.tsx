"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "" })
  }

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      if (data.session) {
        localStorage.setItem("supabaseSession", JSON.stringify(data.session))
      }
      return data
    },
    onSuccess: () => {
      resetForm()
      onClose()
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const res = await axios.post("/api/register", {
        name,
        email,
        password,
      })
      const data = res.data
      if (data.error) throw new Error(data.error || "Register failed")
      if (data.session) {
        localStorage.setItem("supabaseSession", JSON.stringify(data.session))
      }
      return data
    },
    onSuccess: () => {
      resetForm()
      onClose()
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
      className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      tabIndex={0}
      aria-label="Login/Register Modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="neobrutalism-card bg-secondary-background p-8 w-full max-w-md relative">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-background rounded"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </Button>

        <h2 className="text-3xl font-heading mb-6 text-center">{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label={isLogin ? "Login form" : "Register form"}>
          {!isLogin && (
            <div>
              <label className="block text-lg font-heading mb-2" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="neobrutalism-input w-full"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                aria-label="Name"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-heading mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="neobrutalism-input w-full"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              aria-label="Email address"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-lg font-heading mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="neobrutalism-input w-full"
              placeholder="Your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>

          {errorMsg && (
            <div className="mb-2 text-red-600 text-sm" role="alert" aria-live="assertive">{errorMsg}</div>
          )}

          <Button
            type="submit"
            className="neobrutalism-button bg-green w-full text-lg"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-base">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            className="font-heading text-lg underline decoration-2 mt-2"
            aria-label={isLogin ? "Switch to register" : "Switch to login"}
          >
            {isLogin ? "Register here" : "Login here"}
          </Button>
        </div>
      </div>
    </div>
  )
}
