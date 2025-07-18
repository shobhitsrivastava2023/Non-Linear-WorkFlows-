import { z } from 'zod';

export const toolkitsRequestSchema = z.object({
  toolkitSlugs: z.array(z.string()).min(1),
});

export type ToolkitsRequest = z.infer<typeof toolkitsRequestSchema>;
