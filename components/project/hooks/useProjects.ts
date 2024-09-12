import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/database.types";
import { QueryConfig } from "@/types/react-query";

async function getProjects(
  client: SupabaseClient<Database, "public">,
  name?: string,
) {
  const query = client.from("projects").select().limit(10);
  if (name) query.ilike("name", `%${name}%`);
  const { data } = await query;

  return data ?? [];
}

type UseProjects = QueryConfig<typeof getProjects> & {
  name?: string;
  client: SupabaseClient<Database, "public">;
};

export function useProjects({ client, name, ...config }: UseProjects) {
  return useQuery({
    queryKey: ["fetch-projects", name],
    queryFn: () => getProjects(client, name),
    ...config,
  });
}
