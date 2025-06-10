'use client'
import { UserAvatar } from '@/app/board/[boardId]/_components/user-avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { connectionIdToColor } from '@/lib/utils'
import { useOthers, useSelf } from '@liveblocks/react/suspense'

const MAX_OTHER_PARTICIPANTS = 2

export const Participants = () => {
  const users = useOthers()
  const currentUser = useSelf()
  const hasMoreUsers = users.length > MAX_OTHER_PARTICIPANTS

  return (
    <div className="absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center gap-2 shadow-md">
      {users.slice(0, MAX_OTHER_PARTICIPANTS).map(({ connectionId, info }) => {
        return (
          <UserAvatar
            key={connectionId}
            src={info.picture}
            name={info.name}
            fallback={info.name?.[0] || 'U'}
            borderColor={connectionIdToColor(connectionId)}
          />
        )
      })}
      {currentUser && (
        <UserAvatar
          src={currentUser.info.picture}
          name={`${currentUser.info.name} (You)`}
          fallback={currentUser.info.name?.[0] || 'U'}
          borderColor={connectionIdToColor(currentUser.connectionId)}
        />
      )}

      {hasMoreUsers && (
        <UserAvatar
          name={`${users.length - MAX_OTHER_PARTICIPANTS} more`}
          fallback={`+${users.length - MAX_OTHER_PARTICIPANTS}`}
        />
      )}
    </div>
  )
}

export function ParticipantsSkeleton() {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md h-12 flex items-center shadow-md w-[100px]">
      <Skeleton className="w-full h-full bg-muted-foreground" />
    </div>
  )
}
