"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Github, Mail, Loader2 } from "lucide-react"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    github: false,
    google: false,
  })

  const handleSignIn = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }))
    try {
      const result = await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[350px] bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Sign In</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Choose your preferred sign-in method</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => handleSignIn("github")}
              disabled={isLoading.github}
              className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors duration-300"
            >
              {isLoading.github ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Github
            </button>
            <button
              onClick={() => handleSignIn("google")}
              disabled={isLoading.google}
              className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors duration-300"
            >
              {isLoading.google ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Google
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950">
          <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
            By signing in, you agree to our{" "}
            <a href="/terms" className="underline hover:text-neutral-800 dark:hover:text-neutral-200">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-neutral-800 dark:hover:text-neutral-200">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}