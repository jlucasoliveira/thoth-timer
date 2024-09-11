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
import { Tables, TablesInsert, TablesUpdate } from "@/database.types";
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
import { extractTagsDiffs, parseFormDataIntoPayload } from "./utils";
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
  const subtitle = task?.id ? "Editar" : "Adicionar";
  const [isLoading, setLoading] = useState<boolean>(false);
  const [projectSearch, setProjectSearch] = useState<string>();
  const [tagSearch, setTagSearch] = useState<string>();
  const [tags, setTags] = useState<Tables<"tags">[]>([]);
  const [projects, setProjects] = useState<Tables<"projects">[]>([]);

  const form = useForm<FormType>({ resolver: zodResolver(schema) });

  const endAt = form.watch("endAt");
  const startAt = form.watch("startAt");
  const startAtTime = form.watch("startAtTime");

  async function handleUpdate(
    payload: TablesUpdate<"tasks">,
    tags: Tables<"tags">[] | null,
  ) {
    if (!task) throw new Error(`Object is undefined`);

    const changes = extractChangedValues(task, payload);
    await client.from("tasks").update(changes).eq("id", task.id);

    if (tags) {
      const [deleted, newest] = extractTagsDiffs(task.tags, tags);

      if (deleted.length > 0) {
        await client
          .from("tags_tasks")
          .delete()
          .eq("task_id", task.id)
          .in("tag_id", deleted);
      }
      if (newest.length > 0) {
        await client
          .from("tags_tasks")
          .insert(newest.map((tag_id) => ({ tag_id, task_id: task.id })));
      }
    } else if (task.tags.length > 0) {
      await client.from("tags_tasks").delete().eq("task_id", task.id);
    }
  }

  async function handleCreate(
    payload: TablesUpdate<"tasks">,
    tags: Tables<"tags">[] | null,
  ) {
    const { data: task } = await client
      .from("tasks")
      .insert(payload as TablesInsert<"tasks">)
      .returns<Tables<"tasks">>();

    if (task && tags && (tags.length ?? 0) > 0) {
      await client
        .from("tags_tasks")
        .insert(tags.map(({ id }) => ({ tag_id: id, task_id: task.id })));
    }
  }

  async function onSubmit(data: FormType) {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await client.auth.getUser();

      const payload = parseFormDataIntoPayload(data, user!);

      if (task?.id) await handleUpdate(payload, data.tags);
      else await handleCreate(payload, data.tags);

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

  async function loadTags(name?: string) {
    try {
      const query = client.from("tags").select();
      if (name) query.ilike("name", `%${name}%`);

      const { data } = await query;
      if (data) setTags(data);
    } catch (error) {
      toast({
        content: "Não foi possível buscar suas tags",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    loadProjects(projectSearch);
  }, [projectSearch]);

  useEffect(() => {
    loadTags(tagSearch);
  }, [tagSearch]);

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
              setSearch={setProjectSearch}
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
            <Combobox
              isMulti
              control={form.control}
              name="tags"
              label="Tags"
              placeholder="Selecione pelo menos uma tag"
              options={tags}
              setSearch={setTagSearch}
              getOptionLabel={(tag) =>
                tag ? (tag.name ?? `Tag ${tag.id}`) : ""
              }
              getOptionValue={(tag) => tag?.id?.toString?.() ?? ""}
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
