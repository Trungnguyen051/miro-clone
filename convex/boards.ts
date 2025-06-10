import { getAllOrThrow } from 'convex-helpers/server/relationships'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'
import { query } from './_generated/server'

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', userId.subject).eq('orgId', args.orgId),
        )
        .order('desc')
        .collect()

      const ids = favoritedBoards.map((board) => board.boardId as Id<'boards'>)

      const boards = await getAllOrThrow(ctx.db, ids)

      return boards.map((board) => ({
        ...board,
        isFavorite: true,
      }))
    }

    const title = args.search as string

    let boards = []

    if (title) {
      boards = await ctx.db
        .query('boards')
        .withSearchIndex('search_title', (q) =>
          q.search('title', title).eq('orgId', args.orgId),
        )
        .collect()
    } else {
      boards = await ctx.db
        .query('boards')
        .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
        .order('desc')
        .collect()
    }

    const boardsWithFavorites = boards.map((board) => {
      return ctx.db
        .query('userFavorites')
        .withIndex('by_user_board', (q) =>
          q.eq('userId', userId.subject).eq('boardId', board._id),
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          }
        })
    })

    const boardsWithFavoritesBoolean = await Promise.all(boardsWithFavorites)
    return boardsWithFavoritesBoolean
  },
})
