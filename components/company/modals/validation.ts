import { z } from "zod";

export const schema = z.object({
  name: z.string(),
  priceByHour: z.coerce.number().positive(),
});

export type FormType = z.infer<typeof schema>;
