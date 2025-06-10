'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useRenameModal } from '@/store/use-rename-modal'
import { FormEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

export const RenameModal = () => {
  const { isOpen, initialValues, onClose } = useRenameModal()
  const [title, setTitle] = useState(initialValues.title)
  const { mutate, pending } = useApiMutation(api.board.update)

  useEffect(() => {
    setTitle(initialValues.title)
  }, [initialValues.title])

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success(`Successfully updated board title to "${title.trim()}"`)
        onClose()
      })
      .catch((error) => {
        toast.error(`Failed to update board title. Error: ${error.message}`)
      })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter a new title for your board. The title should not exceed 60
          characters.
        </DialogDescription>
        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={pending}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
