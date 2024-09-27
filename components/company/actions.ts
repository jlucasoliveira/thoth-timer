"use server";

import { randomUUID } from "crypto";
import { encodedRedirectTyped } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

type Params = {
  id: number;
  name?: string | null;
};

export async function deleteCompany({ id, name }: Params) {
  const requestId = randomUUID();

  try {
    const client = createClient();
    await client.from("companies").delete().eq("id", id).throwOnError();
  } catch (error) {
    return encodedRedirectTyped(
      "error",
      "/companies",
      "Ocorreu um erro ao remover a empresa.",
      new URLSearchParams([["digest", requestId]]),
    );
  } finally {
    return encodedRedirectTyped(
      "success",
      "/companies",
      `Empresa "${name ?? id}" removida com sucesso!`,
      new URLSearchParams([["digest", requestId]]),
    );
  }
}
