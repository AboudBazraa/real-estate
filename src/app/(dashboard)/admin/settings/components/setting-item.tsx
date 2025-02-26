import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"

interface SettingItemProps {
  title: string
  description: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export function SettingItem({ title, description, checked, onCheckedChange, disabled }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <Label htmlFor={title}>{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={title}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={title}
      />
    </div>
  )
}