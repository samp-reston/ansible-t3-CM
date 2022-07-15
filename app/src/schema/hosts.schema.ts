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
  groupId: z.string().nullable(),

  rigName: z.string().nullable(),
  modelYear: z.number().nullable(),
  model: z.string().nullable(),
  vin: z.string().nullable(),
  intrepid: z.number().nullable(),
  niHostname: z.string().nullable(),
  rigType: z.string().nullable(),
  testUser: z.string().nullable(),

  assetBridge: z.string().nullable(),
  gcpUploader: z.string().nullable(),
  cssLaunch: z.string().nullable(),
  corvus: z.string().nullable(),
  corvusParallel: z.string().nullable(),
  vehicleSpy: z.string().nullable(),
  jlrSDK: z.string().nullable(),
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
