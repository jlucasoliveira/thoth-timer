import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/utils";

const routes = [
  { route: "/companies", label: "empresas" },
  { route: "/projects", label: "projetos" },
  { route: "/tags", label: "tags" },
  { route: "/tasks", label: "tarefas" },
];

export async function Menu() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {routes.map(({ label, route }) => (
          <NavigationMenuItem key={route}>
            <Link href={route} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "capitalize")}
              >
                {label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
