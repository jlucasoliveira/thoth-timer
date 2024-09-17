import { z } from "zod";

export const schema = z.object({
  description: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;

export const defaultValues: FormType = {
  description: "",
};
