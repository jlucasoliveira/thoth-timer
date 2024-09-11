import { Tables } from "@/database.types";

export enum TaskStatus {
  Start = "start",
  Paused = "paused",
  Doing = "doing",
  Done = "done",
}

export type Task = Tables<"tasks"> & {
  project: Pick<Tables<"projects">, "id" | "name"> | null;
  spend_time: Pick<Tables<"task_logs">, "start_at" | "end_at">[];
};

export type TaskQuery = Omit<Tables<"tasks">, "description" | "project_id" | "user_id"> & {
  project: Pick<Tables<"projects">, "id" | "name"> | null;
  spend_time: Pick<Tables<"task_logs">, "start_at" | "end_at">[];
};

export type TaskWithHour = TaskQuery & {
  hour: string;
};
