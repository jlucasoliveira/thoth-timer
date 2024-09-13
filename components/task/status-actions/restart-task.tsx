"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Task, TaskStatus } from "../types";
import { AlertAction } from "./alert-action";

type RestartTaskProps = {
  task: Task;
};

export function RestartTask({ task }: RestartTaskProps) {
  const router = useRouter();
  const client = createClient();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!task.end_at)
        throw new Error("Não é possível reiniciar uma tarefa não finalizada");

      const now = new Date().toJSON();
      await client.from("task_logs").insert({
        end_at: now,
        task_id: task.id,
        user_id: user!.id,
        start_at: task.end_at,
        description: "TAREFA REINICIADA",
      });

      await client
        .from("tasks")
        .update({ status: TaskStatus.Doing, end_at: null })
        .eq("id", task.id);

      router.refresh();
    } catch (error) {
      toast({
        title: "Não foi possível reiniciar a tarefa.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <AlertAction
      open={open}
      Icon={RotateCw}
      loading={loading}
      setOpen={setOpen}
      onSubmit={onSubmit}
      description="Deseja reiniciar a tarefa?"
      tooltip="Reiniciar tarefa"
    />
  );
}
