'use client'
import { ToolButton } from '@/app/board/[boardId]/_components/tool-button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from 'lucide-react'

export const Toolbar = () => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => {}}
          isActive={true}
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() => {}}
        />
        <ToolButton
          label="Sticky Note"
          icon={StickyNote}
          onClick={() => {}}
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() => {}}
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() => {}}
        />
        <ToolButton
          label="Pen"
          icon={Pencil}
          onClick={() => {}}
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={() => {}}
          isDisabled={true} // Example of a disabled button
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={() => {}}
          isDisabled={true} // Example of a disabled button
        />
      </div>
    </div>
  )
}

export function ToolbarSkeleton() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-y-4 h-[360px] w-[52px] rounded-md shadow-md">
      <Skeleton className="w-full h-full bg-muted-foreground" />
    </div>
  )
}
