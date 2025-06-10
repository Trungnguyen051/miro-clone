import { Skeleton } from '@/components/ui/skeleton'

export const Info = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      Information about the board will be displayed here.
    </div>
  )
}

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md h-12 flex items-center shadow-md w-[300px]">
      <Skeleton className="w-full h-full bg-muted-foreground" />
    </div>
  )
}
