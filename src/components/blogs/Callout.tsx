import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const calloutVariants = cva(
  "my-6 flex gap-2.5 rounded-lg border p-4 transition-colors duration-200",
  {
    variants: {
      type: {
        info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200",
        warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900 text-yellow-900 dark:text-yellow-200",
        success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 text-green-900 dark:text-green-200",
        error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
)

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof calloutVariants> {
  children: React.ReactNode
  title?: string
  icon?: React.ReactNode
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
}

export function Callout({
  children,
  type = "info",
  title,
  icon,
  className,
  ...props
}: CalloutProps) {
  // @ts-ignore
  const Icon = icon || icons[type]

  return (
    <div
      className={cn(calloutVariants({ type }), className) + `flex justify-center items-center`}
      role="alert"
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0 z-20 mt-1 md:mx-2" aria-hidden="true" />
      <div className="flex-1">
        {title && (
          <h3 className="font-semibold mb-2">
            {title}
          </h3>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}