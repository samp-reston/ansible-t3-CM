import z from 'zod'

export const hostSchema = z.object({
  rigId: z.string().min(1),
  hostname: z.string().min(1),
  groupId: z.string().nullable(),
  createdAt: z.string().min(1),
  lastUpdated: z.string().min(1)
})

export type Host = z.TypeOf<typeof hostSchema>

export const registerNewHostSchema = z.object({
  rigId: z.string().min(1),
  hostname: z.string().min(1)
})

export type RegisterNewHost = z.TypeOf<typeof registerNewHostSchema>

export const removeHostSchema = z.object({
  hostname: z.string().min(1)
})

export type RemoveHost = z.TypeOf<typeof removeHostSchema>

export const updateHostSchema = z.object({
  hostname: z.string().min(1),
  rigId: z.string().min(1)
})

export type UpdateHost = z.TypeOf<typeof updateHostSchema>
