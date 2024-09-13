import { Table } from "@/components/table";
import { AddProjectModal } from "@/components/project/modal/add-project-modal";
import { createClient } from "@/utils/supabase/server";
import { getPages, getPagination } from "@/lib/pagination";
import { columns } from "./columns";

type ProjectsProps = {
  searchParams: Record<string, string | null>;
};

export default async function Projects({ searchParams }: ProjectsProps) {
  const supabase = createClient();
  const ranges = getPagination(searchParams?.page);
  const { data: projects, count } = await supabase
    .from("projects")
    .select(
      `
    id,
    name,
    companies (id, name)
  `,
      { count: "exact" },
    )
    .range(...ranges)
    .order("name");

  if (!projects) return;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Projetos</h3>
        <AddProjectModal />
      </div>
      <Table columns={columns} data={projects} pages={getPages(count)} />
    </div>
  );
}
