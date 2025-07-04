import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface NewBoardButtonProps {
  orgId: string
  disabled?: boolean
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const { mutate, pending } = useApiMutation(api.board.create)
  const router = useRouter()

  const onClick = async () => {
    if (disabled) return
    mutate({
      orgId,
      title: 'Untitled Board',
    })
      .then((id) => {
        toast.success('Successfully created board!')
        router.push(`/board/${id}`)
      })
      .catch((error) => {
        toast.error(`Failed to create board: ${error.message}`)
      })
  }

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        'col-span-1 cursor-pointer aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6',
        (pending || disabled) &&
          'opacity-75 cursor-not-allowed hover:bg-blue-600',
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">New Board</p>
    </button>
  )
}
