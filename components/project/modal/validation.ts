import { z } from "zod";
import { Tables } from "@/database.types";

export const schema = z.object({
  name: z.string(),
  company: z.custom<Tables<"companies">>(),
});

export type FormType = z.infer<typeof schema>;
