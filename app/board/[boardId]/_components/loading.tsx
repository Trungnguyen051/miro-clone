import { InfoSkeleton } from '@/app/board/[boardId]/_components/info'
import { ParticipantsSkeleton } from '@/app/board/[boardId]/_components/participants'
import { ToolbarSkeleton } from '@/app/board/[boardId]/_components/toolbar'
import { Loader } from 'lucide-react'

export const Loading = () => {
  return (
    <main className="w-full h-full relative bg-neutral-100 touch-none flex items-center justify-center">
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  )
}
