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

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Chambre Classique',
    type: 'single',
    price: 850,
    capacity: 1,
    size: 25,
    amenities: ['WiFi', 'TV', 'Climatisation', 'Mini-bar', 'Coffre-fort'],
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
    description: 'Une chambre confortable idéale pour les voyageurs solo, avec toutes les commodités modernes.',
    available: true,
  },
  {
    id: '2',
    name: 'Chambre Supérieure',
    type: 'double',
    price: 1200,
    capacity: 2,
    size: 35,
    amenities: ['WiFi', 'TV 55"', 'Climatisation', 'Mini-bar', 'Coffre-fort', 'Balcon', 'Vue ville'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    description: 'Chambre spacieuse avec vue panoramique, parfaite pour les couples ou les voyages d\'affaires.',
    available: true,
  },
  {
    id: '3',
    name: 'Suite Junior',
    type: 'suite',
    price: 2500,
    capacity: 3,
    size: 55,
    amenities: ['WiFi', 'TV 65"', 'Climatisation', 'Mini-bar Premium', 'Coffre-fort', 'Terrasse', 'Jacuzzi', 'Service en chambre 24h'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    description: 'Suite élégante avec salon séparé et terrasse privée offrant une vue imprenable.',
    available: true,
  },
  {
    id: '4',
    name: 'Suite Royale',
    type: 'deluxe',
    price: 5000,
    capacity: 4,
    size: 90,
    amenities: ['WiFi Premium', 'TV 75"', 'Climatisation', 'Bar privé', 'Coffre-fort', 'Terrasse panoramique', 'Jacuzzi', 'Butler 24h', 'Spa privé'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    description: 'Notre suite la plus luxueuse avec services exclusifs et vue panoramique exceptionnelle.',
    available: true,
  },
  {
    id: '5',
    name: 'Chambre Familiale',
    type: 'double',
    price: 1500,
    capacity: 4,
    size: 45,
    amenities: ['WiFi', 'TV 55"', 'Climatisation', 'Mini-bar', 'Coffre-fort', 'Lit enfant disponible'],
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
    description: 'Chambre idéale pour les familles avec espace de jeu pour enfants.',
    available: false,
  },
  {
    id: '6',
    name: 'Suite Présidentielle',
    type: 'deluxe',
    price: 8000,
    capacity: 6,
    size: 150,
    amenities: ['WiFi Premium', 'Home Cinema', 'Climatisation multi-zone', 'Cave à vin', 'Coffre-fort biométrique', 'Piscine privée', 'Majordome', 'Hélisurface'],
    images: ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800'],
    description: 'L\'expérience ultime du luxe avec piscine privée et services personnalisés.',
    available: true,
  },
];

export const reservations: Reservation[] = [
  {
    id: '1',
    roomId: '1',
    roomName: 'Chambre Classique',
    guestName: 'Jean Dupont',
    guestEmail: 'jean.dupont@email.com',
    checkIn: '2026-02-01',
    checkOut: '2026-02-05',
    guests: 1,
    totalPrice: 3400,
    status: 'confirmed',
    createdAt: '2026-01-20',
  },
  {
    id: '2',
    roomId: '3',
    roomName: 'Suite Junior',
    guestName: 'Marie Martin',
    guestEmail: 'marie.martin@email.com',
    checkIn: '2026-02-10',
    checkOut: '2026-02-14',
    guests: 2,
    totalPrice: 10000,
    status: 'pending',
    createdAt: '2026-01-25',
  },
  {
    id: '3',
    roomId: '2',
    roomName: 'Chambre Supérieure',
    guestName: 'Pierre Durand',
    guestEmail: 'pierre.durand@email.com',
    checkIn: '2026-01-15',
    checkOut: '2026-01-18',
    guests: 2,
    totalPrice: 3600,
    status: 'completed',
    createdAt: '2026-01-10',
  },
  {
    id: '4',
    roomId: '4',
    roomName: 'Suite Royale',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.bernard@email.com',
    checkIn: '2026-02-20',
    checkOut: '2026-02-25',
    guests: 3,
    totalPrice: 25000,
    status: 'confirmed',
    createdAt: '2026-01-28',
  },
];

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
