import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import Rooms from "@/pages/Rooms";
import RoomDetails from "@/pages/RoomDetails";
import Booking from "@/pages/Booking";
import Reservations from "@/pages/Reservations";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminRooms from "@/pages/admin/Rooms";
import AdminReservations from "@/pages/admin/AdminReservations";
import AdminContacts from "@/pages/admin/Contacts";
import AdminSettings from "@/pages/admin/Settings";
import AdminReviews from "@/pages/admin/AdminReviews";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { AppearanceProvider } from "./context/AppearanceContext";
import { SettingsProvider } from "./context/SettingsContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <AppearanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={createBrowserRouter([
              { path: "/", element: <Index /> },
              { path: "/rooms", element: <Rooms /> },
              { path: "/rooms/:id", element: <RoomDetails /> },
              { path: "/booking/:id", element: <Booking /> },
              { path: "/login", element: <Login /> },
              { path: "/register", element: <Register /> },
              { path: "/contact", element: <Contact /> },
              { path: "/forgot", element: <ForgotPassword /> },
              // Protected Client Routes
              { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
              { path: "/reservations", element: <ProtectedRoute><Reservations /></ProtectedRoute> },
              { path: "/favorites", element: <ProtectedRoute><Favorites /></ProtectedRoute> },
              // Protected Admin Routes
              { path: "/admin", element: <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute> },
              { path: "/admin/rooms", element: <ProtectedRoute adminOnly><AdminRooms /></ProtectedRoute> },
              { path: "/admin/reservations", element: <ProtectedRoute adminOnly><AdminReservations /></ProtectedRoute> },
              { path: "/admin/contacts", element: <ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute> },
              { path: "/admin/settings", element: <ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute> },
              { path: "/admin/reviews", element: <ProtectedRoute adminOnly><AdminReviews /></ProtectedRoute> },
              // 404
              { path: "*", element: <NotFound /> }
            ])} />
          </TooltipProvider>
        </AppearanceProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
