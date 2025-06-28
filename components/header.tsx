"use client"

import React, { useState, useRef } from "react"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginModal } from "@/components/login-modal"
import { useSupabaseAuth } from "@/providers/supabase-auth-provider"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Image from "next/image"
import { useTheme } from "next-themes"




function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-9 h-9 rounded-full object-cover border-2 border-primary"
      />
    )
  }
  const initial = name?.[0]?.toUpperCase() || "U"
  return (
    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg border-2 border-primary">
      {initial}
    </div>
  )
}

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useSupabaseAuth()
  const { resolvedTheme } = useTheme()


  const handleProtectedRoute = (e: React.MouseEvent, route: string) => {
    if (!user) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // User info
  const userName = user?.user_metadata?.name || user?.email || "User"
  const userEmail = user?.email || ""
  const avatarUrl = user?.user_metadata?.avatar_url

  // Dropdown kapama (tıklama dışı)
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <>
      <header className="sticky top-0 bg-yellow relative z-50 dark:bg-background dark:border-border bg-background shadow-md backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-4xl font-heading text-foreground flex items-center gap-2">
              <Image
                src={resolvedTheme === "dark" ? "/assets/darklogo.png" : "/assets/lightlogo.png"}
                alt="Judy Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <Avatar className="w-9 h-9 rounded-full object-cover border-2 border-primary">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-heading">{userName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {dropdownOpen && (
                    <Card className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50 py-2">
                      <div className="px-4 py-2 flex items-center space-x-3 border-b">
                        <Avatar className="w-9 h-9 rounded-full object-cover border-2 border-primary">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{userName}</div>
                          <div className="text-xs text-gray-500">{userEmail}</div>
                        </div>
                      </div>
                      <Link
                        href="/settings"
                        className="block w-full text-left px-4 py-3 hover:bg-gray-100 font-medium text-foreground"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <Button
                        className="w-full text-left py-3 border-t border-border hover:bg-gray-100 font-medium hover:text-red-600 bg-red-600 text-white cursor-pointer rounded-none"
                        onClick={logout}
                        variant="destructive"
                      >
                        Logout
                      </Button>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-foreground text-sm px-4 py-2"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-foreground text-sm px-4 py-2"
                  >
                    Register
                  </Button>
                </div>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <Button
              className="lg:hidden bg-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b-4 border-border z-50 shadow-lg">
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
                    <div className="flex items-center space-x-3">
                      <UserAvatar name={userName} avatarUrl={avatarUrl} />
                      <div>
                        <div className="font-bold text-foreground">{userName}</div>
                        <div className="text-xs text-foreground">{userEmail}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        logout()
                        closeMobileMenu()
                      }}
                      className="bg-foreground text-sm w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={() => {
                        setShowLoginModal(true)
                        closeMobileMenu()
                      }}
                      className="neobrutalism-button bg-secondary-background text-sm w-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        setShowLoginModal(true)
                        closeMobileMenu()
                      }}
                      className="neobrutalism-button bg-green text-sm w-full"
                    >
                      Register
                    </Button>
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