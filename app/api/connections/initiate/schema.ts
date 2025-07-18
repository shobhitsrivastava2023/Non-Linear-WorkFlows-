import { z } from 'zod';

export const initiateConnectionSchema = z.object({
  authConfigId: z.string().min(1),
});

export type InitiateConnectionRequest = z.infer<
  typeof initiateConnectionSchema
>;
