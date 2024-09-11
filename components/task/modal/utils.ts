import { User } from "@supabase/supabase-js";
import { TablesUpdate } from "@/database.types";
import { FormType } from "./validation";
import { mergeDateHour } from "../utils";

export function parseFormDataIntoPayload(
  data: FormType,
  user: User,
): TablesUpdate<"tasks"> {
  return {
    name: data.name,
    slug: data.slug,
    user_id: user.id,
    status: data.status,
    project_id: data.project?.id,
    description: data.description,
    start_at:
      data.startAt && data.startAtTime
        ? mergeDateHour(data.startAt, data.startAtTime).toJSON()
        : undefined,
    end_at:
      data.endAt && data.endAtTime
        ? mergeDateHour(data.endAt, data.endAtTime).toJSON()
        : undefined,
  };
}
