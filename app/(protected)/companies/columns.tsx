"use client";

import { ColumnDef } from "@tanstack/react-table";
import { currencyFormat } from "@/lib/currency";
import { DeleteCompany } from "@/components/company/delete-company";
import { EditCompanyModal } from "@/components/company/modals/edit-company-modal";
import { Tables } from "@/database.types";

export const columns: ColumnDef<Tables<"companies">>[] = [
  { header: "Nome", accessorKey: "name" },
  {
    header: "Preço p/ hora (R$)",
    accessorFn: (row) => currencyFormat(row.price_by_hour),
  },
  {
    header: "Ações",
    cell: ({ row: { original: company } }) => (
      <div className="flex flex-row gap-1">
        <EditCompanyModal key={company.id} company={company} />
        <DeleteCompany company={company} />
      </div>
    ),
  },
];
