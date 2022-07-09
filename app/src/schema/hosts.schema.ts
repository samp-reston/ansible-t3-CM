import z from 'zod'

export const registerNewHostSchema = z.object({
  rigId: z.string(),
  hostname: z.string()
})

export type RegisterNewHost = z.TypeOf<typeof registerNewHostSchema>
