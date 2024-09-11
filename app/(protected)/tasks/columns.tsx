"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeleteTask } from "@/components/task/delete-task";
import { translateTaskStatus } from "@/components/task/utils";
import { TaskStatus, TaskWithHour } from "@/components/task/types";
import { EditTaskModal } from "@/components/task/modal/edit-task-modal";
import { StatusActions } from "@/components/task/status-actions/actions";

export const columns: ColumnDef<TaskWithHour>[] = [
  { header: "Projeto", accessorKey: "project.name" },
  { header: "Task", accessorKey: "slug" },
  { header: "Titulo", accessorKey: "name" },
  { header: "Tempo percorrido", accessorKey: "hour" },
  {
    header: "Status",
    accessorFn: (row) => translateTaskStatus(row.status as TaskStatus),
  },
  {
    header: "Ações",
    cell: ({ row: { original: task } }) => (
      <div className="flex flex-row gap-1">
        <StatusActions task={task as any} />
        <EditTaskModal key={task.id} task={task as any} />
        <DeleteTask task={task as any} />
      </div>
    ),
  },
];
