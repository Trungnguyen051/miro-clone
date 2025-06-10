import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface FooterProps {
  isFavorite?: boolean
  title: string
  authorLabel: string
  createAtLabel: string
  onClick: () => void
  disabled: boolean
}

export const Footer = ({
  isFavorite = false,
  title,
  authorLabel,
  createAtLabel,
  onClick,
  disabled,
}: FooterProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    onClick()
  }

  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-x-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground truncate text-[11px]">
        {authorLabel}, {createAtLabel}
      </p>

      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-muted-foreground hover:text-blue-600',
          disabled && 'cursor-not-allowed opacity-75',
        )}
      >
        <Star
          className={cn('h-4 w-4', isFavorite && 'fill-blue-600 text-blue-600')}
        />
      </button>
    </div>
  )
}
