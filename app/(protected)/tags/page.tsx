import { createClient } from "@/utils/supabase/server";
import { AddTagModal } from "@/components/tags/modals/add-tag-modal";
import { Table } from "@/components/table";
import { columns } from "./columns";

export default async function Tasks() {
  const client = createClient();
  const { data: tags, count } = await client.from("tags").select().limit(10);

  if (!tags) return;

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Tags</h3>
        <AddTagModal />
      </div>
      <Table
        columns={columns}
        data={tags}
        pages={Math.ceil((count ?? 0) / 10)}
      />
    </div>
  );
}
