"use client";

import { useState } from "react";
import { Archive } from "lucide-react";
import { Task } from "../types";
import { archiveTask } from "./actions";
import { AlertAction } from "./alert-action";

type ArchiveTaskProps = {
  task: Pick<Task, "id" | "end_at">;
};

export function ArchiveTask({ task }: ArchiveTaskProps) {
  const action = archiveTask.bind(null, task);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <AlertAction
      open={open}
      Icon={Archive}
      action={action}
      setOpen={setOpen}
      tooltip="Arquivar tarefa"
      description="Deseja arquivar a tarefa?"
    />
  );
}
