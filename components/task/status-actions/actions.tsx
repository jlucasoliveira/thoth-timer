"use client";

import { DoneTask } from "./done-task";
import { PauseTask } from "./pause-task";
import { StartTask } from "./start-task";
import { Task, TaskStatus } from "../types";

type StatusActionsProps = {
  task: Task;
};

export function StatusActions({ task }: StatusActionsProps) {
  const components = [];

  if (
    !task.status ||
    [TaskStatus.Doing, TaskStatus.Start].includes(task.status as TaskStatus)
  )
    components.push(<PauseTask key="pause" task={task} />);
  else if (task.status !== TaskStatus.Done)
    components.push(<StartTask key="start" task={task} />);

  if (task.status !== TaskStatus.Done)
    components.push(<DoneTask key="done" task={task} />);

  return components;
}
