"use client";

import { useState } from "react";
import { Square } from "lucide-react";
import { Task } from "../types";
import { doneTask } from "./actions";
import { AlertAction } from "./alert-action";

type DoneTaskProps = {
  task: Pick<Task, "id" | "status">;
};

export function DoneTask({ task }: DoneTaskProps) {
  const action = doneTask.bind(null, task);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <AlertAction
      open={open}
      Icon={Square}
      action={action}
      setOpen={setOpen}
      tooltip="Finalizar tarefa"
      description="Deseja finalizar a tarefa?"
    />
  );
}
