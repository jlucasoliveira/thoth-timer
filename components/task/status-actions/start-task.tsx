"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AlertAction } from "./alert-action";
import { Task, TaskStatus } from "../types";
import { TablesUpdate } from "@/database.types";

type StartTaskProps = {
  task: Task;
};

export function StartTask({ task }: StartTaskProps) {
  const router = useRouter();
  const client = createClient();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const title = task?.status === TaskStatus.Todo ? "Iniciar" : "Continuar";

  async function onSubmit() {
    setLoading(true);
    try {
      const payload: TablesUpdate<"tasks"> = { status: TaskStatus.Doing };

      if (task.status === TaskStatus.Paused) {
        await client
          .from("task_logs")
          .update({ end_at: new Date().toJSON() })
          .eq("task_id", task.id)
          .order("start_at", { ascending: false })
          .limit(1);
      } else if (task.status !== TaskStatus.Todo) {
        throw new Error(
          "Uma tarefa iniciada, em andamento ou finalizada não pode ser iniciada/continuada",
        );
      } else {
        payload.start_at = new Date().toJSON();
      }

      await client.from("tasks").update(payload).eq("id", task.id);
      router.refresh();
    } catch (error) {
      toast({
        title: "Não foi possível iniciar a tarefa!",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <AlertAction
      open={open}
      Icon={Play}
      loading={loading}
      setOpen={setOpen}
      onSubmit={onSubmit}
      tooltip={`${title} tarefa`}
      description="Deseja iniciar essa tarefa?"
    />
  );
}
