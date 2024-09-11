"use client";

import { z } from "zod";
import { useState } from "react";
import { Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Task, TaskStatus } from "../types";
import { AlertAction } from "./alert-action";

const schema = z.object({
  description: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  description: "",
};

type PauseTaskProps = {
  task: Task;
};

export function PauseTask({ task }: PauseTaskProps) {
  const router = useRouter();
  const client = createClient();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({ resolver: zodResolver(schema), defaultValues });

  async function onSubmit(data: FormType) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      await client
        .from("tasks")
        .update({ status: TaskStatus.Paused })
        .eq("id", task.id);

      await client.from("task_logs").insert({
        task_id: task.id,
        user_id: user!.id,
        description: data.description,
      });
      toast({ title: `Tarefa ${task.slug} pausada` });
      router.refresh();
    } catch (error) {
      toast({
        title: "Não foi possível pausar a tarefa.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <AlertAction
      open={open}
      Icon={Pause}
      loading={loading}
      setOpen={setOpen}
      tooltip="Pausar tarefa"
      description="Deseja pausar essa tarefa?"
      onSubmit={form.handleSubmit(onSubmit)}
      form={
        <FormProvider {...form}>
          <Input
            control={form.control}
            label="Motivo/Causa"
            name="description"
          />
        </FormProvider>
      }
    />
  );
}
