"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

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
  const { login, register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register(formData.name, formData.email, formData.password)
      }
      onClose()
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="neobrutalism-card bg-secondary-background p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-background rounded">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-heading mb-6 text-center">{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-lg font-heading mb-2">Name</label>
              <input
                type="text"
                className="neobrutalism-input w-full"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-heading mb-2">Email</label>
            <input
              type="email"
              className="neobrutalism-input w-full"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-heading mb-2">Password</label>
            <input
              type="password"
              className="neobrutalism-input w-full"
              placeholder="Your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="neobrutalism-button bg-green w-full text-lg">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-base">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <button onClick={() => setIsLogin(!isLogin)} className="font-heading text-lg underline decoration-2 mt-2">
            {isLogin ? "Register here" : "Login here"}
          </button>
        </div>
      </div>
    </div>
  )
}
