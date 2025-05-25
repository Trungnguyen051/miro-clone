'use client'

import { Item } from '@/app/(dashboard)/_components/sidebar/item'
import { useOrganizationList } from '@clerk/nextjs'

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  if (!userMemberships?.data?.length) return null

  return (
    <ul className="space-y-4">
      {userMemberships.data.map((membership) => (
        <Item
          key={membership.organization.id}
          id={membership.organization.id}
          name={membership.organization.id}
          imageUrl={membership.organization.imageUrl}
        />
      ))}
    </ul>
  )
}
