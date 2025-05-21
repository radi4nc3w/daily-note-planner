
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useLocation, Link } from "react-router-dom";
import { UserRound, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
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
            
            {isAuthenticated ? (
              <>
                <NavigationMenuItem>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <UserRound size={18} />
                    <span className={location.pathname === '/profile' ? 'text-primary underline' : ''}>
                      Профиль
                    </span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button 
                    variant="ghost" 
                    className="text-sm font-medium p-0"
                    onClick={logout}
                  >
                    Выйти
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <NavigationMenuItem>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <LogIn size={18} />
                  <span className={location.pathname === '/login' ? 'text-primary underline' : ''}>
                    Войти
                  </span>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
