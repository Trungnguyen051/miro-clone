import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useOrganization } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import Image from 'next/image'
import { toast } from 'sonner'

export const EmptyBoards = () => {
  const { organization } = useOrganization()
  const mutate = useMutation(api.board.create)

  const onClick = async () => {
    if (!organization) return
    mutate({
      orgId: organization?.id,
      title: 'Untitled Board',
    })
      .then(() => {
        toast.success('Successfully created board!')
        // TODO: redirect to the new board with the board id
      })
      .catch((error) => {
        toast.error(`Failed to create board: ${error.message}`)
      })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-boards.svg"
        alt="Empty Boards"
        height={140}
        width={140}
      />
      <h2 className="text-2xl font-semibold mt-6">No boards!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create a board to start organizing your projects and tasks.
      </p>
      <div className="mt-6">
        <Button
          size="lg"
          onClick={onClick}
        >
          Create Board
        </Button>
      </div>
    </div>
  )
}
