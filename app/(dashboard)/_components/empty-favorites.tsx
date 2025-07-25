import Image from 'next/image'

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-favorites.svg"
        alt="Empty Favorites"
        height={140}
        width={140}
      />
      <h2 className="text-2xl font-semibold mt-6">No favorite boards!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try adding some boards to your favorites by clicking the star icon on a
        board.
      </p>
    </div>
  )
}
