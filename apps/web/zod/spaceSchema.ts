import { z } from "zod";

export const SpaceSchema = z.object({
  id: z.string().uuid().optional(),
  spaceName: z.string().min(1, { message: "Space name is required" }),
  headerName: z.string().min(1, { message: "Header name is required" }),
  image: z.string().url({ message: "Invalid URL for image" }),
  msg: z.string().min(1, { message: "Message is required" }),
});

export type SpaceType = z.infer<typeof SpaceSchema>;
