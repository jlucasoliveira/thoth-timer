"use client";

import { z } from "zod";
import { useState } from "react";
import { Pause } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input";
import { Task } from "../types";
import { AlertAction } from "./alert-action";
import { pauseTask } from "./actions";

const schema = z.object({
  description: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
  description: "",
};

type PauseTaskProps = {
  task: Pick<Task, "id" | "status">;
};

export function PauseTask({ task }: PauseTaskProps) {
  const action = pauseTask.bind(null, task);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm({ resolver: zodResolver(schema), defaultValues });

  return (
    <AlertAction
      open={open}
      Icon={Pause}
      action={action}
      setOpen={setOpen}
      tooltip="Pausar tarefa"
      description="Deseja pausar essa tarefa?"
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
