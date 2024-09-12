"use client";

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
import { Button } from "@/components/ui/button";
import { Tables, TablesInsert } from "@/database.types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/input";
import { createClient } from "@/utils/supabase/client";
import { Combobox } from "@/components/combobox";
import { FormType, schema } from "./validation";
import { parseFormDataIntoPayload } from "./utils";
import { extractChangedValues } from "@/lib/utils";

export type Project = Pick<Tables<"projects">, "id" | "name"> & {
  companies: Pick<Tables<"companies">, "id" | "name"> | null;
};

type ProjectFormModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  project?: Project;
};

export function ProjectFormModal({
  isOpen,
  setOpen,
  project,
}: ProjectFormModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const client = createClient();
  const [search, setSearch] = useState<string>();
  const subtitle = project?.id ? "Editar" : "Adicionar";
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<FormType>({ resolver: zodResolver(schema) });
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);

  async function onSubmit(data: FormType) {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await client.auth.getUser();
      const payload = parseFormDataIntoPayload(data, user!);
      if (project?.id) {
        const changes = extractChangedValues(project, payload);
        await client.from("projects").update(changes).eq("id", project.id);
      } else {
        await client
          .from("projects")
          .insert(payload as TablesInsert<"projects">);
        form.reset();
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Ocorreu um erro ao salvar a empresa" });
    }
    setLoading(false);
  }

  async function loadCompanies(name?: string) {
    try {
      const query = client.from("companies").select();
      if (name) query.ilike("name", `%${name}%`);

      const { data } = await query;
      if (data) setCompanies(data);
    } catch (error) {
      toast({
        content: "Não foi possível buscar as empresas",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    loadCompanies(search);
  }, [search]);

  useEffect(() => {
    if (project) {
      form.setValue("name", project.name ?? "");
      if (project.companies) form.setValue("company", project.companies as any);
    }
  }, [project, form.setValue]);

  return (
    <Dialog modal open={isOpen || isLoading} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subtitle} projeto</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div>
            <Input control={form.control} name="name" label="Nome" required />
            <Combobox
              required
              name="company"
              label="Empresa"
              options={companies}
              setSearch={setSearch}
              control={form.control}
              placeholder="Selecione uma empresa"
              getOptionLabel={(company) =>
                company ? (company.name ?? `Empresa ${company.id}`) : ""
              }
              getOptionValue={(company) => company?.id?.toString?.() ?? ""}
            />
          </div>
        </FormProvider>
        <DialogFooter>
          <Button
            className="flex flex-row gap-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            Salvar
            {isLoading ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : null}
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
