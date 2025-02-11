import { Button } from "@/components/ui/button";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "wouter";
import { LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationBar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          NearbyDine
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/favorites">My Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => auth.signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signInWithGoogle()}>Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
