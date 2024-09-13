'use client'

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Twitter, Mail, MapPin, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FooterLink as FooterLinkType } from "@/types/types"
import Link from "next/link"

const socialLinks = [
  { icon: Github, href: "https://github.com/harshitkumar9030", label: "GitHub" },
  { icon: Mail, href: "mailto:harshitkumar9030@gmail.com", label: "Email" },
  { icon: Twitter, href: "https://twitter.com/OhHarshit", label: "Twitter" },
]

const FooterLink = ({ icon: Icon, href, label }: FooterLinkType) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group relative text-neutral-600 dark:text-neutral-400 transition-colors duration-300"
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon className="h-5 w-5 transition-transform duration-500 transform group-hover:scale-110 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 relative z-10" />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 rounded-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <span className="sr-only">{label}</span>
      </a>
    </Button>
  )
}

const AnimatedText = ({ text }: { text: string }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={text}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.span>
  </AnimatePresence>
)

export default function Footer() {
  const [lastVisitedFrom, setLastVisitedFrom] = useState("")
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchVisitorData = async () => {
      setIsLoading(true)
      setError("")

      // Check if the view has already been registered in this session
      const viewRegistered = sessionStorage.getItem('viewRegistered')

      if (!viewRegistered) {
        try {
          // Fetch IP address from ipify API
          const ipResponse = await fetch('https://api.ipify.org/?format=json')
          const ipData = await ipResponse.json()
          const ip = ipData.ip

          // Send a POST request to update and get visitor data
          const response = await fetch("/api/visitor", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ip }),
          })

          if (!response.ok) {
            throw new Error("Failed to fetch visitor data")
          }

          const data = await response.json()
          setLastVisitedFrom(`${data.city}, ${data.country}`)
          setViewCount(data.views)

          // Mark the view as registered in this session
          sessionStorage.setItem('viewRegistered', 'true')
        } catch (error) {
          console.error("Error fetching visitor data:", error)
          setError("Unable to fetch visitor data")
          setLastVisitedFrom("Unknown Location")
          setViewCount(null)
        }
      } else {
        // If view is already registered, just fetch the current data
        try {
          const response = await fetch("/api/visitor")
          if (!response.ok) {
            throw new Error("Failed to fetch visitor data")
          }
          const data = await response.json()
          setLastVisitedFrom(`${data.city}, ${data.country}`)
          setViewCount(data.views)
        } catch (error) {
          console.error("Error fetching visitor data:", error)
          setError("Unable to fetch visitor data")
          setLastVisitedFrom("Unknown Location")
          setViewCount(null)
        }
      }

      setIsLoading(false)
    }

    fetchVisitorData()
  }, [])

  return (
    <footer className="py-8 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <motion.div
              className="flex space-x-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {socialLinks.map((link, index) => (
                <FooterLink key={index} {...link} />
              ))}
            </motion.div>

            <motion.div
              className="text-[13px] leading-[1.24rem] font-medium text-neutral-600 dark:text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              © {new Date().getFullYear()} LeonCyriac.
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col items-center md:items-end space-y-2 text-sm text-neutral-500 dark:text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Last visitor from</span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                {isLoading ? (
                  <AnimatedText text="Loading..." />
                ) : error ? (
                  <AnimatedText text={error} />
                ) : (
                  <AnimatedText text={lastVisitedFrom} />
                )}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col space-y-2 md:mt-0 text-sm text-neutral-500 dark:text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-200"
            >
              Built with Next.js
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
            <div className="flex justify-center sm:justify-start items-center space-x-2">
              <Eye className="h-4 w-4 flex-shrink-0" />
              <span>Views:</span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                {isLoading ? (
                  <AnimatedText text="Loading..." />
                ) : error ? (
                  <AnimatedText text={error} />
                ) : viewCount !== null ? (
                  <AnimatedText text={`${viewCount}`} />
                ) : (
                  <AnimatedText text="0" />
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}