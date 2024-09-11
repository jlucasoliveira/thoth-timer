import { createClient } from "@/utils/supabase/server";
import { AddProjectModal } from "@/components/project/modal/add-project-modal";
import { Table } from "@/components/table";
import { columns } from "./columns";

export default async function Projects() {
  const supabase = createClient();
  const { data: projects, count } = await supabase.from("projects").select(`
    id,
    name,
    companies (id, name)
  `);

  if (!projects) return;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Projetos</h3>
        <AddProjectModal />
      </div>
      <Table
        columns={columns}
        data={projects}
        pages={Math.ceil((count ?? 0) / 10)}
      />
    </div>
  );
}
