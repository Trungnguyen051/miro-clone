'use client'
import { BoardList } from '@/app/(dashboard)/_components/board-list'
import { EmptyOrg } from '@/app/(dashboard)/_components/empty-org'
import { useOrganization } from '@clerk/nextjs'
import { useParams } from 'next/navigation'

export default function DashboardPage() {
  const params = useParams<{ search?: string; favorites?: string }>()
  const { organization } = useOrganization()

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList
          orgId={organization.id}
          query={params}
        />
      )}
    </div>
  )
}
