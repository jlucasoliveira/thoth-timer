"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { TablesUpdate } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirectTyped } from "@/utils/utils";
import { Task, TaskStatus } from "../types";
import { schema } from "./validation";

type Params = Pick<Task, "id" | "status">;

export async function startTask(task: Params) {
  const requestId = randomUUID();
  try {
    const client = createClient();
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
    revalidatePath("/tasks");
  } catch (error) {
    return encodedRedirectTyped(
      "error",
      "/tasks",
      "Não foi possível iniciar a tarefa!",
      new URLSearchParams([["digest", requestId]]),
    );
  }
}

export async function pauseTask(task: Params, formData?: FormData) {
  const requestId = randomUUID();
  try {
    const client = createClient();
    const { data } = await schema.safeParseAsync({
      description: formData?.get?.("description"),
    });

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
      description: data?.description,
    });
    revalidatePath("/tasks");
  } catch (error) {
    return encodedRedirectTyped(
      "error",
      "/tasks",
      "Não foi possível pausar a tarefa.",
      new URLSearchParams([["digest", requestId]]),
    );
  }
}

export async function doneTask(task: Params) {
  const requestId = randomUUID();
  try {
    const client = createClient();

    const end_at = new Date().toJSON();
    const { error, data: lastLog } = await client
      .from("task_logs")
      .select()
      .eq("task_id", task.id)
      .order("start_at", { ascending: false, nullsFirst: true })
      .order("end_at", { ascending: false, nullsFirst: true })
      .limit(1)
      .single();

    if (!error && lastLog.end_at === null) {
      await client.from("task_logs").update({ end_at }).eq("id", lastLog.id);
    }

    await client
      .from("tasks")
      .update({ status: TaskStatus.Done, end_at })
      .eq("id", task.id);

    revalidatePath("/tasks");
  } catch (error) {
    return encodedRedirectTyped(
      "error",
      "/tasks",
      "Não foi possível parar a tarefa.",
      new URLSearchParams([["digest", requestId]]),
    );
  }
}

export async function restartTask(task: Pick<Task, "id" | "end_at">) {
  const requestId = randomUUID();
  try {
    const client = createClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!task.end_at)
      return encodedRedirectTyped(
        "error",
        "/tasks",
        "Não é possível reiniciar uma tarefa não finalizada.",
        new URLSearchParams([["digest", requestId]]),
      );

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

    revalidatePath("/tasks");
  } catch (error) {
    return encodedRedirectTyped(
      "error",
      "/tasks",
      "Não foi possível reiniciar a tarefa.",
      new URLSearchParams([["digest", requestId]]),
    );
  }
}

export async function deleteTask(task: Pick<Task, "id" | "name">) {
  const requestId = randomUUID();
  try {
    const client = createClient();
    await client.from("tasks").delete().eq("id", task.id);
    encodedRedirectTyped(
      "success",
      "/tasks",
      `Tarefa "${task.name}" removida com sucesso!`,
      new URLSearchParams([["digest", requestId]]),
    );
  } catch (error) {
    return encodedRedirectTyped(
      "error",
      "/tasks",
      "Ocorreu um erro ao excluir a tarefa.",
      new URLSearchParams([["digest", requestId]]),
    );
  }
}
