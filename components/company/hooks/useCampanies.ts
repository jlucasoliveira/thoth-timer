import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/database.types";
import { QueryConfig } from "@/types/react-query";

async function getCompanies(
  client: SupabaseClient<Database, "public">,
  name?: string,
) {
  const query = client.from("companies").select().limit(10);
  if (name) query.ilike("name", `%${name}%`);
  const { data } = await query;

  return data ?? [];
}

type UseCompanies = QueryConfig<typeof getCompanies> & {
  name?: string;
  client: SupabaseClient<Database, "public">;
};

export function useCompanies({ client, name, ...config }: UseCompanies) {
  return useQuery({
    queryKey: ["fetch-companies", name],
    queryFn: () => getCompanies(client, name),
    ...config,
  });
}
