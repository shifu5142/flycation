import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IconInputProps extends React.ComponentProps<typeof Input> {
  label: string
  icon: LucideIcon
  id: string
}

export function IconInput({
  label,
  icon: Icon,
  id,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="size-3.5 text-primary" />
        {label}
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          className={cn("rounded-xl bg-background pl-10", className)}
          {...props}
        />
      </div>
    </div>
  )
}
