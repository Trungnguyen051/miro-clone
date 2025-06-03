import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const EmptyBoards = () => {
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
        <Button size="lg">Create Board</Button>
      </div>
    </div>
  )
}
