import { useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { QueryConfig } from "@/types/react-query";

async function getTags(
  client: SupabaseClient<Database, "public">,
  name?: string,
) {
  const query = client.from("tags").select().limit(10);
  if (name) query.ilike("name", `%${name}%`);
  const { data } = await query;

  return data ?? [];
}

type UseTags = QueryConfig<typeof getTags> & {
  name?: string;
  client: SupabaseClient<Database, "public">;
};

export function useTags({ client, name, ...config }: UseTags) {
  return useQuery({
    queryKey: ["fetch-tags", name],
    queryFn: () => getTags(client, name),
    ...config,
  });
}
