import { createClient } from "@/utils/supabase/server";
import { AddCompanyModal } from "@/components/company/modals/add-company-modal";
import { Table } from "@/components/table";
import { columns } from "./columns";

export default async function Companies() {
  const supabase = createClient();

  const { data: companies, count } = await supabase
    .from("companies")
    .select()
    .limit(10);

  if (!companies) return;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Empresas</h3>
        <AddCompanyModal />
      </div>
      <Table
        columns={columns as any}
        data={companies}
        pages={Math.ceil((count ?? 0) / 10)}
      />
    </div>
  );
}
