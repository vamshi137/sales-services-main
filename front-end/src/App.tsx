import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/employee/Login";
import Dashboard from "@/employee/Dashboard";
import Employees from "@/employee/Employees";
import Attendance from "@/employee/Attendance";
import Leave from "@/employee/Leave";
import Payroll from "@/employee/Payroll";
import Performance from "@/employee/Performance";

import NotFound from "./employee/NotFound";
import Assets from "./employee/Assests";
import Training from "./employee/Training";
import TravelExpense from "./employee/TravelExpense";
import Grievance from "./employee/Grievance";
import Settings from "./employee/Settings";
import Profile from "./employee/Profile";
import Help from "./components/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/organization" element={<Dashboard />} />
                <Route path="/recruitment" element={<Dashboard />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/training" element={<Training />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/travel" element={<TravelExpense />} />
                <Route path="/disciplinary" element={<Dashboard />} />
                <Route path="/grievance" element={<Grievance />} />
                <Route path="/separation" element={<Dashboard />} />
                <Route path="/compliance" element={<Dashboard />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<Help />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
