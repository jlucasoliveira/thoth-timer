import { Menu as MenuIcon } from "lucide-react";
import {
  Sheet as SheetRoot,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "./theme-switcher";
import { Menu } from "./menu";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

export async function Sheet() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user)
    return (
      <div className="flex flex-row justify-between gap-2">
        <Button asChild size="sm" variant="outline" className="flex-grow">
          <Link href="/sign-in">Entrar</Link>
        </Button>
        <Button asChild size="sm" variant="default" className="flex-grow">
          <Link href="/sign-up">Cadastrar</Link>
        </Button>
      </div>
    );

  return (
    <SheetRoot>
      <SheetTrigger className="sm:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col flex-1 justify-between"
      >
        <div>
          <SheetHeader>
            <SheetTitle className="font-bold text-lg">Chono Timer</SheetTitle>
          </SheetHeader>
          <Menu orientation="vertical" />
        </div>
        <SheetFooter>
          <div className="flex flex-row justify-between gap-4">
            <form action={signOutAction}>
              <Button type="submit" variant={"outline"}>
                Sair
              </Button>
            </form>
            <ThemeSwitcher />
          </div>
        </SheetFooter>
      </SheetContent>
    </SheetRoot>
  );
}
