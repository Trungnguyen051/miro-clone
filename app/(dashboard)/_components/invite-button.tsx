import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OrganizationProfile } from '@clerk/nextjs'
import { Plus } from 'lucide-react'

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none w-fit">
        <DialogTitle className="hidden" />
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  )
}
