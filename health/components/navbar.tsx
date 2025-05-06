"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, Moon, Shield, Sun, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const { user, isAuthenticated, signOut, isSupabaseConfigured,isAdmin } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Different nav items based on authentication state
  const navItems = isAuthenticated
    ? [
        { name: "Dashboard", path: "/" },
        { name: "Medical Records", path: "/medical-records" },
        ...(isAdmin ? [{ name: "Insurance Claims", path: "/admin/dashboard/digital-signature" }] : []),
       ...(isAdmin ? [{ name: "Admin Dashboard", path: "/admin/dashboard" }] : []),
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-2 py-1 text-lg ${
                      isActive(item.path) ? "font-medium text-teal-600" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">HealthSecure</span>
          </Link>
          <nav className="hidden md:flex md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm ${
                  isActive(item.path) ? "font-medium text-teal-600" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isSupabaseConfigured && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {user?.user_metadata?.full_name || user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            isSupabaseConfigured && (
              <Link href="/login">
                <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Sign In
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
