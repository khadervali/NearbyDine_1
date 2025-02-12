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
import { ThemeProvider } from "@/components/theme-provider"
import PopularPlaces from "@/pages/popular-places";

function Router() {
  const [user] = useAuthState(auth);
  const userId = user ? 1 : undefined; // In a real app, this would come from your backend

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed background elements */}
      <div className="fixed inset-0 bg-[#0d111c]"> {/* Base dark background */}
        <div className="absolute inset-0 glow-effect" />
        
        {/* Floating shapes with fixed positioning */}
        <div className="fixed w-[40vw] h-[40vw] top-[-10%] left-[-5%] floating-shape" />
        <div className="fixed w-[35vw] h-[35vw] top-[30%] right-[-10%] 
          floating-shape [animation-delay:2s] 
          [border-radius:66%_34%_37%_63%/57%_48%_52%_43%]" />
        <div className="fixed w-[30vw] h-[30vw] bottom-[-5%] left-[20%] 
          floating-shape [animation-delay:4s] 
          [border-radius:41%_59%_47%_53%/41%_44%_56%_59%]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavigationBar />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/restaurants">
              <Restaurants userId={userId} />
            </Route>
            <Route path="/popular-places" component={PopularPlaces} />
            <Route path="/restaurants/:placeId">
              <RestaurantDetails />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;