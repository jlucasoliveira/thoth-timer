import { createClient } from "@/utils/supabase/server";
import { getPages, getPagination } from "@/lib/pagination";
import { AddTagModal } from "@/components/tags/modals/add-tag-modal";
import { Table } from "@/components/table";
import { columns } from "./columns";

type TagsProps = {
  searchParams: Record<string, string | null>;
};

export default async function Tags({ searchParams }: TagsProps) {
  const client = createClient();
  const ranges = getPagination(searchParams?.page);
  const { data: tags, count } = await client
    .from("tags")
    .select("*", { count: "exact" })
    .range(...ranges);

  if (!tags) return;

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Tags</h3>
        <AddTagModal />
      </div>
      <Table columns={columns} data={tags} pages={getPages(count)} />
    </div>
  );
}
