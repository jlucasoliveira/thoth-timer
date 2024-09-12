import { Table } from "@/components/table";
import { createClient } from "@/utils/supabase/server";
import { TaskWithHour } from "@/components/task/types";
import { AddTaskModal } from "@/components/task/modal/add-task-modal";
import { calculateHours, formatHour } from "@/components/task/utils";
import { columns } from "./columns";

export default async function Tasks() {
  const client = createClient();
  const { data: tasks, count } = await client
    .from("tasks")
    .select(
      `
    id,
    name,
    status,
    slug,
    start_at,
    end_at,
    created_at,
    spend_time: task_logs (start_at, end_at),
    project: projects (id, name),
    tags (id, name)
  `,
    )
    .limit(10);

  if (!tasks) return;

  const calculatedTasks = tasks.map<TaskWithHour>((task) => ({
    ...task,
    hour: formatHour(calculateHours(task)),
  }));

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Tarefas</h3>
        <AddTaskModal />
      </div>
      <Table
        columns={columns}
        data={calculatedTasks}
        pages={Math.ceil((count ?? 0) / 10)}
      />
    </div>
  );
}
