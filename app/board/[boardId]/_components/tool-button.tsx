import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface ToolButtonProps {
  label: string
  icon: LucideIcon
  onClick: () => void
  isActive?: boolean
  isDisabled?: boolean
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive = false,
  isDisabled = false,
}: ToolButtonProps) => {
  return (
    <Hint
      label={label}
      side="right"
      sideOffset={14}
    >
      <Button
        disabled={isDisabled}
        size="icon"
        onClick={onClick}
        variant={isActive ? 'boardActive' : 'board'}
      >
        <Icon />
      </Button>
    </Hint>
  )
}
