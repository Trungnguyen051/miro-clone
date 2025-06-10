'use client'

import { Info } from '@/app/board/[boardId]/_components/info'
import { Participants } from '@/app/board/[boardId]/_components/participants'
import { Toolbar } from '@/app/board/[boardId]/_components/toolbar'

export const Canvas = () => {
  return (
    <main className="w-full h-screen relative bg-neutral-100 touch-none">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  )
}
