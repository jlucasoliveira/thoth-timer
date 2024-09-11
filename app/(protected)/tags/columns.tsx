"use client";

import { ColumnDef } from "@tanstack/react-table";
import { dateTimeFormat } from "@/lib/datetime";
import { Tables } from "@/database.types";
import { DeleteTag } from "@/components/tags/delete-tag";
import { EditTagModal } from "@/components/tags/modals/edit-tag-modal";

export const columns: ColumnDef<Tables<"tags">>[] = [
  { header: "Titulo", accessorKey: "name" },
  { header: "Data de criação", accessorFn: (row) => dateTimeFormat(row.created_at) },
  {
    header: "Ações",
    cell: ({ row: { original: tag } }) => (
      <div className="flex flex-row gap-1">
        <EditTagModal key={tag.id} tag={tag} />
        <DeleteTag tag={tag} />
      </div>
    ),
  },
];
