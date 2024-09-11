import { z } from "zod";

export const schema = z.object({
  name: z.string(),
});

export type FormType = z.infer<typeof schema>;
