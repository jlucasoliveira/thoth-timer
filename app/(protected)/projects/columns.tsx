"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/components/project/modal/project-form-modal";
import { DeleteProject } from "@/components/project/delete-project";
import { EditProjectModal } from "@/components/project/modal/edit-project-modal";

export const columns: ColumnDef<Project>[] = [
  { header: "Nome", accessorKey: "name" },
  { header: "Empresa", accessorKey: "companies.name" },
  {
    header: "Ações",
    cell: ({ row: { original: project } }) => (
      <div className="flex flex-row gap-1">
        <EditProjectModal key={project.id} project={project} />
        <DeleteProject project={project as any} />
      </div>
    ),
  },
];
