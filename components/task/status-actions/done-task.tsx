"use client";

import { useState } from "react";
import { Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Task, TaskStatus } from "../types";
import { AlertAction } from "./alert-action";

type DoneTaskProps = {
  task: Task;
};

export function DoneTask({ task }: DoneTaskProps) {
  const router = useRouter();
  const client = createClient();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit() {
    setLoading(true);
    try {
      const { error, data: lastLog } = await client
        .from("task_logs")
        .select()
        .eq("task_id", task.id)
        .order("start_at", { ascending: false, nullsFirst: true })
        .order("end_at", { ascending: false, nullsFirst: true })
        .limit(1)
        .single();

      if (!error && lastLog.end_at === null) {
        await client
          .from("task_logs")
          .update({ end_at: new Date().toJSON() })
          .eq("id", lastLog.id);
      }

      await client
        .from("tasks")
        .update({ status: TaskStatus.Done, end_at: new Date().toJSON() })
        .eq("id", task.id);

      router.refresh();
    } catch (error) {
      toast({
        title: "Não foi possível parar a tarefa.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <AlertAction
      open={open}
      Icon={Square}
      loading={loading}
      setOpen={setOpen}
      onSubmit={onSubmit}
      description="Deseja finalizar a tarefa?"
      tooltip="Finalizar tarefa"
    />
  );
}
