import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'types'

type Data = {
  message: string
  error: Error
  User: Partial<User>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<Data>>
) {
  const body = req?.body
  const actions = {
    create: async () => {
      if (req.method !== 'POST')
        return res.status(405).json({ message: 'Method not allowed' })
      try {
        res.status(200).json({ message: 'User created successfully' })
      } catch (error: any) {
        res.status(500).json({
          error: error,
          message: error?.message || 'Error creating user',
        })
      }
    },
    update: async () => {
      if (req.method !== 'PUT')
        return res.status(405).json({ message: 'Method not allowed' })
      try {
        res.status(200).json({ message: 'User updated successfully' })
      } catch (error) {
        res.status(500).json({ error: error as Error })
      }
    },
    delete: async () => {
      if (req.method !== 'DELETE')
        return res.status(405).json({ message: 'Method not allowed' })
      try {
        res.status(200).json({
          message: 'User deleted successfully',
          User: { uid: body.uid },
        })
      } catch (error) {
        res.status(500).json({ error: error as Error })
      }
    },
    deleteAll: async () => {
      if (req.method !== 'DELETE')
        return res.status(405).json({ message: 'Method not allowed' })
      try {
        const { uids, dbRef } = body as { uids: string[]; dbRef: string }
        if (uids.length) {
          res.status(200).json({
            message: `${uids.length} users deleted successfully`,
          })
        }
      } catch (error) {
        res.status(500).json({ error: error as Error })
      }
    },
  }
  const action = req.query?.action as keyof typeof actions
  if (action in actions) return await actions[action]()
  res.status(404).json({ message: 'Not found' })
}
