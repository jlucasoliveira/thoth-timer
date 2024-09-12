import { Table } from "@/components/table";
import { AddCompanyModal } from "@/components/company/modals/add-company-modal";
import { createClient } from "@/utils/supabase/server";
import { getPages, getPagination } from "@/lib/pagination";
import { columns } from "./columns";

type CompaniesProps = {
  searchParams: Record<string, string | null>;
};

export default async function Companies({ searchParams }: CompaniesProps) {
  const supabase = createClient();
  const ranges = getPagination(searchParams?.page);
  const { data: companies, count } = await supabase
    .from("companies")
    .select("*", { count: "exact" })
    .range(...ranges);

  if (!companies) return;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Empresas</h3>
        <AddCompanyModal />
      </div>
      <Table columns={columns} data={companies} pages={getPages(count)} />
    </div>
  );
}
