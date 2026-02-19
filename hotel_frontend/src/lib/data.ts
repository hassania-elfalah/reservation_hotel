export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  price: number;
  capacity: number;
  size: number;
  amenities: string[];
  images: (string | { chemin_image: string; type_media?: 'image' | 'video' })[];
  description: string;
  available: boolean;
  atmosphere?: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
}

export const roomTypes = {
  single: 'Chambre Simple',
  double: 'Chambre Double',
  suite: 'Suite',
  deluxe: 'Suite Deluxe',
};

// Fallback empty arrays (data should be loaded from API)
export const rooms: Room[] = [];
export const reservations: Reservation[] = [];

export const getStatusLabel = (status: Reservation['status']) => {
  const labels = {
    confirmed: 'Confirmée',
    pending: 'En attente',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };
  return labels[status];
};

export const getStatusColor = (status: Reservation['status']) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  return colors[status];
};
