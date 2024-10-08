import { z } from "zod";
import { Tables } from "@/database.types";
import { TaskStatus } from "../types";

export const schema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  project: z.custom<Tables<"projects">>().optional().nullable(),
  status: z.custom<TaskStatus>().default(TaskStatus.Todo),
  tags: z.array(z.custom<Tables<"tags">>()).default([]),
  startAt: z.coerce.date().optional().nullable(),
  startAtTime: z.string().optional().nullable(),
  endAt: z.coerce.date().optional().nullable(),
  endAtTime: z.string().optional().nullable(),
});

export type FormType = z.infer<typeof schema>;

export const defaultValues: FormType = {
  name: "",
  slug: "",
  status: TaskStatus.Todo,
  tags: [],
  description: "",
};
