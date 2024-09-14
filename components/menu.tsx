import Link from "next/link";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
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

type MenuProps = Pick<NavigationMenuProps, "orientation">;

export async function Menu({ orientation }: MenuProps) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={cn(
          orientation === "vertical"
            ? "flex flex-col items-start py-10"
            : undefined,
        )}
      >
        {routes.map(({ label, route }) => (
          <NavigationMenuItem key={route}>
            <Link href={route} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "capitalize",
                  orientation === "vertical" ? "my-2" : undefined,
                )}
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
