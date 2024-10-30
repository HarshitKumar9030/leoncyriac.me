import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'success' | 'error'
  className?: string
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
}

const styles = {
  info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200",
  warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900 text-yellow-900 dark:text-yellow-200",
  success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 text-green-900 dark:text-green-200",
  error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200",
}

export function Callout({
  children,
  type = "info",
  className,
}: CalloutProps) {
  const Icon = icons[type]

  return (
    <div
      className={cn(
        "my-6 flex gap-2.5 rounded-lg border p-4",
        styles[type],
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  )
}