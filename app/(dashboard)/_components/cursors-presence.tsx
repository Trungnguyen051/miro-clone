'use client'

import { Cursor } from '@/app/(dashboard)/_components/cursor'
import { useOthersConnectionIds } from '@liveblocks/react/suspense'
import { memo } from 'react'

const Cursors = () => {
  const ids = useOthersConnectionIds()

  return (
    <>
      {ids.map((id) => (
        <Cursor
          key={id}
          connectionId={id}
        />
      ))}
    </>
  )
}

export const CursorPresence = memo(() => {
  return (
    <>
      <Cursors />
    </>
  )
})

CursorPresence.displayName = 'CursorPresence'
