import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateOrganization } from '@clerk/nextjs'
import Image from 'next/image'

export const EmptyOrg = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/element.svg"
        alt="Element"
        width={200}
        height={200}
      />
      <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started with your projects and tasks.
      </p>

      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Organization</Button>
          </DialogTrigger>
          <DialogContent className="w-fit p-0">
            <DialogTitle className="hidden" />
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
