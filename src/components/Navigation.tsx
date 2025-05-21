
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useLocation, Link } from "react-router-dom";
import { UserRound } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <div className="border-b mb-6">
      <div className="container max-w-screen-xl mx-auto flex justify-between items-center py-3 px-4">
        <h1 className="text-xl font-bold">Ежедневник</h1>
        
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-primary underline' : ''}`}>
                Главная
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium">
                <UserRound size={18} />
                <span className={location.pathname === '/profile' ? 'text-primary underline' : ''}>
                  Профиль
                </span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
