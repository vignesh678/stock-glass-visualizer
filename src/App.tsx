
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import QuarterlyResults from "./pages/QuarterlyResults";
import DividendHistory from "./pages/DividendHistory";
import HighLowData from "./pages/HighLowData";
import CompanyHistory from "./pages/CompanyHistory";
import Stocks from "./pages/Stocks";
import News from "./pages/News";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/news" element={<News />} />
          <Route path="/stock/:id" element={<StockDetail />} />
          <Route path="/stock/:id/quarterly" element={<QuarterlyResults />} />
          <Route path="/stock/:id/dividends" element={<DividendHistory />} />
          <Route path="/stock/:id/highlow" element={<HighLowData />} />
          <Route path="/stock/:id/history" element={<CompanyHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
