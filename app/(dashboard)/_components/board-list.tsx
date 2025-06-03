'use client'

import { EmptyBoards } from '@/app/(dashboard)/_components/empty-boards'
import { EmptyFavorites } from '@/app/(dashboard)/_components/empty-favorites'
import { EmptySearch } from '@/app/(dashboard)/_components/empty-search'

interface BoardListProps {
  orgId: string
  query: {
    search?: string
    favorites?: string
  }
}

export const BoardList = ({ query }: BoardListProps) => {
  const data = []

  if (!data.length && query.search) {
    return <EmptySearch />
  }

  if (!data.length && query.favorites) {
    return <EmptyFavorites />
  }

  if (!data.length) {
    return <EmptyBoards />
  }

  return <div>{JSON.stringify(query, null, 2)}</div>
}
