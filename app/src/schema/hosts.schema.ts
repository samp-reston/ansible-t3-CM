import z from 'zod'

export const registerNewHostSchema = z.object({
  rigId: z.string().min(1),
  hostname: z.string().min(1)
})

export type RegisterNewHost = z.TypeOf<typeof registerNewHostSchema>
