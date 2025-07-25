'use client'

import { BoardCard } from '@/app/(dashboard)/_components/board-card'
import { EmptyBoards } from '@/app/(dashboard)/_components/empty-boards'
import { EmptyFavorites } from '@/app/(dashboard)/_components/empty-favorites'
import { EmptySearch } from '@/app/(dashboard)/_components/empty-search'
import { NewBoardButton } from '@/app/(dashboard)/_components/new-board-button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

interface BoardListProps {
  orgId: string
  query: {
    search?: string
    favorites?: string
  }
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, {
    orgId: orgId,
    ...query,
  })

  if (data === undefined) {
    return (
      <div>
        <div className="text-3xl">
          {query.favorites ? 'Favorites boards' : 'Team Boards'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton
            orgId={orgId}
            disabled
          />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    )
  }

  if (!data.length && query.search) {
    return <EmptySearch />
  }

  if (!data.length && query.favorites) {
    return <EmptyFavorites />
  }

  if (!data.length) {
    return <EmptyBoards />
  }

  return (
    <div>
      <div className="text-3xl">
        {query.favorites ? 'Favorites boards' : 'Team Boards'}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  )
}
