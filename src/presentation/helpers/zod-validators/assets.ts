import { z } from 'zod'
import { AssetsStatus } from '../../../domain/models/asset'

export const zodCreateAssetObject = z.object({
  name: z.string(),
  description: z.string(),
  status: z.nativeEnum(AssetsStatus),
  model: z.string(),
  owner: z.string(),
  imageURL: z.string(),
  unitId: z.string()
})

export const zodUpdateAssetObject = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(AssetsStatus).optional(),
  model: z.string().optional(),
  owner: z.string().optional(),
  imageURL: z.string().optional(),
  healthLevel: z.number().min(0).max(100).optional()
})
