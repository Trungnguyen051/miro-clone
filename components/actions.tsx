import { ConfirmModal } from '@/components/confirm-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useRenameModal } from '@/store/use-rename-modal'
import {
  DropdownMenu,
  DropdownMenuContentProps,
} from '@radix-ui/react-dropdown-menu'
import { Link2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface ActionsProps {
  children?: React.ReactNode
  side?: DropdownMenuContentProps['side']
  sideOffset?: DropdownMenuContentProps['sideOffset']
  id: string
  title: string
}

export const Actions = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  id,
  title,
}: ActionsProps) => {
  const { mutate, pending } = useApiMutation(api.board.remove)
  const { onOpen } = useRenameModal()

  const onDelete = () => {
    if (pending) return
    mutate({ id })
      .then(() => {
        toast.success(`Successfully deleted board "${title}"`)
      })
      .catch((error) => {
        toast.error(
          `Failed to delete board "${title}". Error: ${error.message}`,
        )
      })
  }

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => {
        toast.success('Board link copied to clipboard!')
      })
      .catch(() => {
        toast.error('Failed to copy board link')
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        onClick={(e) => e.stopPropagation()}
        className="w-60"
      >
        <DropdownMenuItem
          className="p-3 cursor-pointer"
          onClick={onCopyLink}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem
          className="p-3 cursor-pointer"
          onClick={() => onOpen(id, title)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename board
        </DropdownMenuItem>
        <ConfirmModal
          header="Delete board?"
          description="Are you sure you want to delete this board? This action cannot be undone."
          onConfirm={onDelete}
          disabled={pending}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
            <p className="text-red-500">Delete board</p>
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
