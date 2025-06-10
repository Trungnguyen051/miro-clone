import { Canvas } from '@/app/board/[boardId]/_components/canvas'
import { Loading } from '@/app/board/[boardId]/_components/loading'
import { Room } from '@/components/room'

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params

  return (
    <Room
      roomId={boardId}
      fallback={<Loading />}
    >
      <Canvas boardId={boardId} />
    </Room>
  )
}

export default BoardIdPage
