import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const images = [
  '/placeholders/1.svg',
  '/placeholders/2.svg',
  '/placeholders/3.svg',
  '/placeholders/4.svg',
  '/placeholders/5.svg',
  '/placeholders/6.svg',
  '/placeholders/7.svg',
  '/placeholders/8.svg',
  '/placeholders/9.svg',
  '/placeholders/10.svg',
]

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity()
    if (!id) {
      throw new Error('Unauthorized')
    }

    const randomImage = images[Math.floor(Math.random() * images.length)]

    const board = await ctx.db.insert('boards', {
      title: args.title,
      orgId: args.orgId,
      authorId: id.subject,
      authorName: id.name! || 'Anonymous',
      imageUrl: randomImage,
    })

    return board
  },
})

export const remove = mutation({
  args: { id: v.id('boards') },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity()
    if (!id) {
      throw new Error('Unauthorized')
    }

    const userId = id.subject

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', args.id),
      )
      .unique()

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id)
    }

    await ctx.db.delete(args.id)
  },
})

export const update = mutation({
  args: {
    id: v.id('boards'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity()
    if (!id) {
      throw new Error('Unauthorized')
    }
    const title = args.title.trim()
    if (!title) {
      throw new Error('Title cannot be empty')
    }

    if (title.length > 60) {
      throw new Error('Title cannot exceed 60 characters')
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    })

    return board
  },
})

export const favorite = mutation({
  args: { id: v.id('boards'), orgId: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity()
    if (!id) {
      throw new Error('Unauthorized')
    }
    const board = await ctx.db.get(args.id)

    if (!board) {
      throw new Error('Board not found')
    }

    const userId = id.subject

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique()

    if (existingFavorite) {
      throw new Error('Board is already favorited')
    }

    await ctx.db.insert('userFavorites', {
      orgId: args.orgId,
      userId: userId,
      boardId: board._id,
    })

    return board
  },
})

export const unfavorite = mutation({
  args: { id: v.id('boards') },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity()
    if (!id) {
      throw new Error('Unauthorized')
    }
    const board = await ctx.db.get(args.id)

    if (!board) {
      throw new Error('Board not found')
    }

    const userId = id.subject

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique()

    if (!existingFavorite) {
      throw new Error('Favorited board not found')
    }

    await ctx.db.delete(existingFavorite._id)

    return board
  },
})

export const get = query({
  args: { id: v.id('boards') },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id)
    if (!board) {
      throw new Error('Board not found')
    }
    return board
  },
})
