'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/custom/button"

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outline">
        Sign out
      </Button>
    )
  }
  return (
    <Button onClick={() => signIn()}>
      Sign in
    </Button>
  )
}