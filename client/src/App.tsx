import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import ShoppingList from "./pages/ShoppingList";
import Tips from "./pages/Tips";
import Favorites from "./pages/Favorites";
import SettingsPage from "./pages/SettingsPage";
import MealPlan from "./pages/MealPlan";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recipes" component={RecipeList} />
      <Route path="/recipe/:id" component={RecipeDetail} />
      <Route path="/meal-plan" component={MealPlan} />
      <Route path="/shopping" component={ShoppingList} />
      <Route path="/tips" component={Tips} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-body)',
                  borderRadius: '1rem',
                },
              }}
            />
            <div className="app-shell">
              <Router />
              <BottomNav />
            </div>
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
