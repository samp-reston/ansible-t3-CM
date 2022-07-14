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
  hostname: z.string().min(1),
  groupId: z.string().optional(),

  rigName: z.string().optional(),
  modelYear: z.number().optional(),
  model: z.string().optional(),
  vin: z.string().optional(),
  intrepid: z.number().optional(),
  niHostname: z.string().optional(),
  rigType: z.string().optional(),
  testUser: z.string().optional(),

  assetBridge: z.string().optional(),
  gcpUploader: z.string().optional(),
  cssLaunch: z.string().optional(),
  corvus: z.string().optional(),
  corvusParallel: z.string().optional(),
  vehicleSpy: z.string().optional(),
  jlrSDK: z.string().optional(),
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
