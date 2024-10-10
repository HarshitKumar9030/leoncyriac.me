import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup logic
    console.log('Signing up with email:', email)
    setEmail('')
  }

  return (
    <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-6 mt-12">
      <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-200">Subscribe to Our Newsletter</h3>
      <p className="text-purple-700 dark:text-purple-300 mb-4">Stay updated with our latest articles and insights.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-grow"
        />
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Mail className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </form>
    </div>
  )
}