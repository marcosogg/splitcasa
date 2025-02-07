
import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  currency: z.string().min(1, "Currency is required"),
  information: z.string().optional(),
  participants: z.array(
    z.object({
      name: z.string().min(1, "Participant name is required"),
    })
  ).min(1, "At least one participant is required"),
});

export type CreateGroupForm = z.infer<typeof createGroupSchema>;
