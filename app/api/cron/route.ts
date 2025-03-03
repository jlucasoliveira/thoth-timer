import "server-only";

import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // * Keep supabase project unstoppable
  const client = createClient();
  client.from("task_logs").select().returns().then(console.info);

  return Response.json({ success: true });
}
