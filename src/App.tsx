import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StylePage from "./pages/StylePage";
import BeltPage from "./pages/BeltPage";
import LessonPage from "./pages/LessonPage";
import QuizPage from "./pages/QuizPage";
import DictionaryPage from "./pages/DictionaryPage";
import CulturePage from "./pages/CulturePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/style/:styleId" element={<StylePage />} />
          <Route path="/style/:styleId/belt/:beltId" element={<BeltPage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
