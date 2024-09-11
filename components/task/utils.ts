import {
  millisecondsToSeconds,
  secondsToHours,
  secondsToMinutes,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Option } from "../select";
import { TaskQuery, TaskStatus } from "./types";

export function translateTaskStatus(status: TaskStatus): string {
  if (status === TaskStatus.Paused) return "Pausado";
  if (status === TaskStatus.Done) return "Finalizado";
  if (status === TaskStatus.Doing) return "Em andamento";
  return "Iniciado";
}

export function generateStatusOptions(): Option[] {
  return Object.values(TaskStatus).map((value) => ({
    value,
    label: translateTaskStatus(value),
  }));
}

export function extractNaiveTime(naiveDate: string | number | Date): string {
  const awareDate = toZonedTime(naiveDate, "America/Fortaleza");
  const [_, time] = awareDate.toJSON().split("T");
  return time;
}

export function calculateHours(row: TaskQuery): number {
  const pausedTime = row.spend_time
    .sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
    )
    .reduce(
      (acc, cur) =>
        acc +
        ((cur.end_at ? new Date(cur.end_at) : new Date()).getTime() -
          new Date(cur.start_at).getTime()),
      0,
    );
  const totalTime =
    (row.end_at ? new Date(row.end_at) : new Date()).getTime() -
    new Date(row.start_at).getTime();

  return totalTime - pausedTime;
}

export function formatHour(milliseconds: number): string {
  const seconds = millisecondsToSeconds(milliseconds);
  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds) - hours * 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function mergeDateHour(
  date: Date | number | string,
  time: string,
): Date {
  if (typeof date !== "object") date = new Date(date);
  const [hour, minute, seconds] = time.split(":");

  date.setHours(+hour);
  date.setMinutes(+minute);

  if (seconds) date.setSeconds(+seconds);

  return date;
}
