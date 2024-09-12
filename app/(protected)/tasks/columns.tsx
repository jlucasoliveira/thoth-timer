"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  calculateHours,
  formatHour,
  translateTaskStatus,
} from "@/components/task/utils";
import { DeleteTask } from "@/components/task/delete-task";
import { TaskStatus, TaskWithHour } from "@/components/task/types";
import { EditTaskModal } from "@/components/task/modal/edit-task-modal";
import { StatusActions } from "@/components/task/status-actions/actions";

function Timer(task: TaskWithHour) {
  const [hour, setHour] = useState<string>(formatHour(calculateHours(task)));

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(formatHour(calculateHours(task)));
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return hour;
}

export const columns: ColumnDef<TaskWithHour>[] = [
  {
    header: "Projeto",
    accessorFn: ({ project }) => (project ? project.name : ""),
  },
  { header: "Task", accessorKey: "slug" },
  {
    header: "Titulo",
    cell: ({ row: { original: task } }) => (
      <div className="flex flex-row gap-0.5">
        {task.tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="text-[0.55rem] !py-0"
          >
            {tag.name}
          </Badge>
        ))}
        {task.name}
      </div>
    ),
  },
  {
    header: "Tempo percorrido",
    cell: ({ row: { original: task } }) =>
      task.status === TaskStatus.Done ? task.hour : <Timer {...task} />,
  },
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
