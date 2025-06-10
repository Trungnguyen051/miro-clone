/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'convex/react'
import { useState } from 'react'

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState(false)
  const apiMutation = useMutation(mutationFunction)

  const mutate = async (payload: any) => {
    try {
      setPending(true)
      const result = await apiMutation(payload)
      return result
    } catch (error) {
      throw error
    } finally {
      setPending(false)
    }
  }

  return {
    mutate,
    pending,
  }
}
