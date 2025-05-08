import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-toggle";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Showcase from "@/pages/showcase";
import Talents from "@/pages/talents";
import Projects from "@/pages/projects";
import MyProfile from "@/pages/my-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-6 pb-12">
        <Switch>
          <Route path="/" component={Showcase} />
          <Route path="/talents" component={Talents} />
          <Route path="/projects" component={Projects} />
          <Route path="/profile" component={MyProfile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="creativepulse-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
