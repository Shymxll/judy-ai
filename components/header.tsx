"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X } from "lucide-react"

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleProtectedRoute = (e: React.MouseEvent, route: string) => {
    if (!user) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="border-b-4 border-border bg-yellow relative z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-4xl font-heading text-foreground">
              JudyAI
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/start-case"
                className="text-xl font-heading text-foreground hover:underline decoration-4"
                onClick={(e) => handleProtectedRoute(e, "/start-case")}
              >
                Start a Case
              </Link>
              <Link href="/browse-laws" className="text-xl font-heading text-foreground hover:underline decoration-4">
                Browse AI Laws
              </Link>
              <Link
                href="/my-cases"
                className="text-xl font-heading text-foreground hover:underline decoration-4"
                onClick={(e) => handleProtectedRoute(e, "/my-cases")}
              >
                My Cases
              </Link>
            </nav>

            {/* Desktop Auth & Theme */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="font-heading">Hi, {user.name}!</span>
                  <button onClick={logout} className="neobrutalism-button bg-red text-sm px-4 py-2">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="neobrutalism-button bg-secondary-background text-sm px-4 py-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="neobrutalism-button bg-green text-sm px-4 py-2"
                  >
                    Register
                  </button>
                </div>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden neobrutalism-button bg-secondary-background p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-yellow border-b-4 border-border z-40">
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link
                href="/start-case"
                className="block text-xl font-heading text-foreground hover:underline decoration-4"
                onClick={(e) => {
                  handleProtectedRoute(e, "/start-case")
                  closeMobileMenu()
                }}
              >
                Start a Case
              </Link>
              <Link
                href="/browse-laws"
                className="block text-xl font-heading text-foreground hover:underline decoration-4"
                onClick={closeMobileMenu}
              >
                Browse AI Laws
              </Link>
              <Link
                href="/my-cases"
                className="block text-xl font-heading text-foreground hover:underline decoration-4"
                onClick={(e) => {
                  handleProtectedRoute(e, "/my-cases")
                  closeMobileMenu()
                }}
              >
                My Cases
              </Link>

              <div className="border-t-2 border-border pt-4 space-y-4">
                {user ? (
                  <div className="space-y-4">
                    <p className="font-heading text-lg">Hi, {user.name}!</p>
                    <button
                      onClick={() => {
                        logout()
                        closeMobileMenu()
                      }}
                      className="neobrutalism-button bg-red text-sm w-full"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setShowLoginModal(true)
                        closeMobileMenu()
                      }}
                      className="neobrutalism-button bg-secondary-background text-sm w-full"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowLoginModal(true)
                        closeMobileMenu()
                      }}
                      className="neobrutalism-button bg-green text-sm w-full"
                    >
                      Register
                    </button>
                  </div>
                )}
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
