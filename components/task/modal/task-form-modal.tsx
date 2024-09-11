"use client";

import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tables, TablesInsert } from "@/database.types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/textarea";
import { Combobox } from "@/components/combobox";
import { DatePicker } from "@/components/date-picker";
import { createClient } from "@/utils/supabase/client";
import { RequirementIndicator } from "@/components/requirement-indicator";
import { extractNaiveTime, generateStatusOptions } from "../utils";
import { Task, TaskStatus } from "../types";
import { FormType, schema } from "./validation";
import { parseFormDataIntoPayload } from "./utils";
import { extractChangedValues } from "@/lib/utils";

const statusOptions = generateStatusOptions();

type TaskFormModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  task?: Task;
};

export function TaskFormModal({ isOpen, setOpen, task }: TaskFormModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const client = createClient();
  const [search, setSearch] = useState<string>();
  const subtitle = task?.id ? "Editar" : "Adicionar";
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<FormType>({ resolver: zodResolver(schema) });
  const [projects, setProjects] = useState<Tables<"projects">[]>([]);

  const endAt = form.watch("endAt");
  const startAt = form.watch("startAt");
  const startAtTime = form.watch("startAtTime");

  async function onSubmit(data: FormType) {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await client.auth.getUser();
      const payload = parseFormDataIntoPayload(data, user!);
      if (task?.id) {
        const changes = extractChangedValues(task, payload);
        await client.from("tasks").update(changes).eq("id", task.id);
      } else
        await client.from("tasks").insert(payload as TablesInsert<"tasks">);

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Ocorreu um erro ao salvar a empresa" });
    }
    setLoading(false);
  }

  async function loadProjects(name?: string) {
    try {
      const query = client.from("projects").select();
      if (name) query.ilike("name", `%${name}%`);

      const { data } = await query;
      if (data) setProjects(data);
    } catch (error) {
      toast({
        content: "Não foi possível buscar seus projetos",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    loadProjects(search);
  }, [search]);

  useEffect(() => {
    if (task) {
      form.setValue("slug", task.slug ?? "");
      form.setValue("name", task.name ?? "");
      form.setValue("description", task.description ?? "");
      form.setValue("project", task.project as Tables<"projects">);
      form.setValue("status", (task.status as TaskStatus) ?? TaskStatus.Start);

      if (task.start_at) {
        const time = extractNaiveTime(task.start_at);
        form.setValue("startAt", new Date(task.start_at));
        form.setValue("startAtTime", time);
      }

      if (task.end_at) {
        const time = extractNaiveTime(task.end_at);
        form.setValue("endAt", new Date(task.end_at));
        form.setValue("endAtTime", time);
      }
    }
  }, [task, form.setValue]);

  return (
    <Dialog modal open={isOpen || isLoading} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subtitle} tarefa</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div>
            <Input control={form.control} name="slug" label="Task" required />
            <Input control={form.control} name="name" label="Titulo" required />
            <Textarea
              control={form.control}
              name="description"
              label="Descrição"
            />
            <Combobox
              control={form.control}
              name="project"
              label="Projeto"
              placeholder="Selecione um projeto"
              options={projects}
              setSearch={setSearch}
              getOptionLabel={(project) =>
                project ? (project.name ?? `Projeto ${project.id}`) : ""
              }
              getOptionValue={(project) => project?.id?.toString?.() ?? ""}
            />
            <Select
              name="status"
              label="Status"
              control={form.control}
              options={statusOptions}
              placeholder="Selecione um status"
            />
            <span className="text-sm font-medium">
              Iniciado em <RequirementIndicator />
            </span>
            <div className="flex flex-row gap-3 mt-2">
              <DatePicker
                control={form.control}
                name="startAt"
                label="Data"
                asChild
              />
              <Input
                control={form.control}
                name="startAtTime"
                label="Hora"
                type="time"
                className="min-w-20"
                asChild
              />
            </div>
            <span className="text-sm font-medium mt-2">
              Finalizado em <RequirementIndicator />
            </span>
            <div className="flex flex-row gap-3 mt-2">
              <DatePicker
                control={form.control}
                name="endAt"
                label="Data"
                calendarProps={{
                  disabled: (date) => (startAt ? date < startAt : false),
                }}
                asChild
              />
              <Input
                control={form.control}
                name="endAtTime"
                label="Hora"
                type="time"
                className="min-w-20"
                min={
                  startAt && startAtTime && endAt && isSameDay(startAt, endAt)
                    ? startAtTime
                    : undefined
                }
                asChild
              />
            </div>
          </div>
        </FormProvider>
        <DialogFooter>
          <Button
            className="flex flex-row justify-between"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            Salvar
            {isLoading ? <LoaderCircle className="animate-spin" /> : null}
          </Button>
          <Button
            variant="ghost"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
