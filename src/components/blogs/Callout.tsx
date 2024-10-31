import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const calloutVariants = cva(
  "my-6 flex gap-4 rounded-lg border p-4 transition-colors duration-200",
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
  icon?: LucideIcon
}

const icons: Record<NonNullable<CalloutProps['type']>, LucideIcon> = {
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
  const Icon = icon || icons[type] || Info

  return (
    <div
      className={cn(calloutVariants({ type }), className)}
      role="alert"
      {...props}
    >
      <div className="flex-shrink-0 flex justify-center items-center">
        <Icon className="h-5 w-5 mx-2 mt-1" aria-hidden="true" />
      </div>
      <div className="flex-1 space-y-2">
        {title && (
          <h3 className="font-semibold text-base">
            {title}
          </h3>
        )}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}