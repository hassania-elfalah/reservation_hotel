import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import Reservations from "./pages/Reservations";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/Rooms";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminContacts from "./pages/admin/Contacts";
import AdminSettings from "./pages/admin/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

import { AppearanceProvider } from "./context/AppearanceContext";
import { SettingsProvider } from "./context/SettingsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <AppearanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/favorites" element={<Favorites />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/rooms" element={<AdminRooms />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppearanceProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
