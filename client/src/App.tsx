import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavigationBar } from "@/components/navigation-bar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Home from "@/pages/home";
import Restaurants from "@/pages/restaurants";
import RestaurantDetails from "@/pages/restaurant-details";
import NotFound from "@/pages/not-found";

function Router() {
  const [user] = useAuthState(auth);
  const userId = user ? 1 : undefined; // In a real app, this would come from your backend

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/restaurants">
            <Restaurants userId={userId} />
          </Route>
          <Route path="/restaurants/:placeId">
            <RestaurantDetails />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;