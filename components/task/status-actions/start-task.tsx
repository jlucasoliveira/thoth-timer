"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Task, TaskStatus } from "../types";
import { AlertAction } from "./alert-action";
import { startTask } from "./actions";

type StartTaskProps = {
  task: Task;
};

export function StartTask({ task }: StartTaskProps) {
  const action = startTask.bind(null, task);
  const [open, setOpen] = useState<boolean>(false);
  const title = task?.status === TaskStatus.Todo ? "Iniciar" : "Continuar";

  return (
    <AlertAction
      open={open}
      Icon={Play}
      action={action}
      setOpen={setOpen}
      tooltip={`${title} tarefa`}
      description="Deseja iniciar essa tarefa?"
    />
  );
}
