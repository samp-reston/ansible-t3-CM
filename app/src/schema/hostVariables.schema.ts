import z from 'zod'

export const queryHostVariablesSchema = z.object({
  hostname: z.string().min(1)
})

export type HostVariablesQuery = z.TypeOf<typeof queryHostVariablesSchema>
