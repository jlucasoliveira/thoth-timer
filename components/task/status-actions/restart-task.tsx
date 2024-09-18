"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Task } from "../types";
import { AlertAction } from "./alert-action";
import { restartTask } from "./actions";

type RestartTaskProps = {
  task: Pick<Task, "id" | "end_at">;
};

export function RestartTask({ task }: RestartTaskProps) {
  const [open, setOpen] = useState<boolean>(false);
  const action = restartTask.bind(null, task);

  return (
    <AlertAction
      open={open}
      Icon={RotateCw}
      action={action}
      setOpen={setOpen}
      tooltip="Reiniciar tarefa"
      description="Deseja reiniciar a tarefa?"
    />
  );
}
