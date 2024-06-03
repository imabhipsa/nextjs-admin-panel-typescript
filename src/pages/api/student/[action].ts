import { cosmic } from 'constant'
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'types'

type Data = {
  message: string
  error: Error
  data: any
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
        const objects = await cosmic.objects.insertOne({
          title: body.name,
          type: 'students',
          metadata: body,
        })

        res
          .status(200)
          .json({ message: 'Student created successfully', data: objects })
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
        const { id } = body
        delete body.id
        const data = await cosmic.objects.updateOne(id, body)
        res
          .status(200)
          .json({ message: 'Student data updated successfully', data })
      } catch (error) {
        res.status(500).json({ error: error as Error })
      }
    },
    delete: async () => {
      if (req.method !== 'DELETE')
        return res.status(405).json({ message: 'Method not allowed' })
      try {
        const { id } = body
        const data = await cosmic.objects.deleteOne(id)
        res.status(200).json({
          message: 'Student deleted successfully',
          data,
        })
      } catch (error) {
        res.status(500).json({ error: error as Error })
      }
    },

    getAll: async () => {
      if (req.method !== 'GET')
        return res.status(405).json({ message: 'Method not allowed' })
      try {
        const { objects } = await cosmic.objects
          .find({ type: 'students' })
          .props('id,slug,title,metadata,created_at,modified_at')
        res
          .status(200)
          .json({ message: 'Students fetched successfully', data: objects })
      } catch (error: any) {
        res.status(500).json({
          error: error,
          message: error?.message || 'Error fetching data',
        })
      }
    },
  }
  const action = req.query?.action as keyof typeof actions
  if (action in actions) return await actions[action]()

  res.status(404).json({ message: 'Not found' })
}
