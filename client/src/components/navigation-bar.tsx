import { Button } from "@/components/ui/button";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "wouter";
import { LogOut, Menu, Utensils } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocation } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function NavigationBar() {
  const [user, loading] = useAuthState(auth);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-card bg-card/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <Utensils className="h-6 w-6 text-orange-500" />
                <span className="ml-2 text-xl font-bold">
                  <span className="text-orange-500">NearBy</span>
                  <span className="text-blue-900">Dine</span>
                </span>
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-56 glass-card" 
                      align="end"
                    >
                      <DropdownMenuItem className="flex justify-between">
                        {user.email}
                        <LogOut className="h-4 w-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        onClick={() => auth.signOut()}
                        className="text-destructive focus:text-destructive"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={signInWithGoogle}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
