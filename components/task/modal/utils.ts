import { User } from "@supabase/supabase-js";
import { Tables, TablesUpdate } from "@/database.types";
import { mergeDateHour } from "../utils";
import { TaskStatus } from "../types";
import { FormType } from "./validation";

export function parseFormDataIntoPayload(
  data: FormType,
  user: User,
): TablesUpdate<"tasks"> {
  return {
    name: data.name,
    slug: data.slug,
    user_id: user.id,
    status: data.status ?? TaskStatus.Todo,
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

export function extractTagsDiffs(
  currentTags: Array<Pick<Tables<"tags">, "id" | "name">>,
  newTags: FormType["tags"],
): [Array<number>, Array<number>] {
  const newTagsSet = new Set<number>(newTags.map((tag) => tag.id));
  const tagsSet = new Set<number>(currentTags.map((tag) => tag.id));

  const newestTags = newTags.filter((tag) => !tagsSet.has(tag.id));
  const deletedTags = currentTags.filter((tag) => !newTagsSet.has(tag.id));

  return [deletedTags.map((tag) => tag.id), newestTags.map((tag) => tag.id)];
}
