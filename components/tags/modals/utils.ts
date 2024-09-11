import { User } from "@supabase/supabase-js";
import { TablesUpdate } from "@/database.types";
import { FormType } from "./validation";

export function parseFormDataIntoPayload(
  data: FormType,
  user: User,
): TablesUpdate<"tags"> {
  return {
    user_id: user.id,
    name: data.name,
  };
}
