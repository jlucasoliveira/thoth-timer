import { User } from "@supabase/supabase-js";
import { TablesUpdate } from "@/database.types";
import { FormType } from "./validation";

export function parseFormDataIntoPayload(
  data: FormType,
  user: User,
): TablesUpdate<"companies"> {
  return {
    name: data.name,
    user_id: user.id,
    price_by_hour: data.priceByHour,
  };
}
