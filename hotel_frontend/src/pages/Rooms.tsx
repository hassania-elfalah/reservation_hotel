import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import RoomCard from '@/components/rooms/RoomCard';
import RoomFilters, { FilterState } from '@/components/rooms/RoomFilters';
import { Bed, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { Room } from '@/lib/data';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';

const Rooms = () => {
  const [f, setF] = useState<FilterState>({ checkIn: '', checkOut: '', guests: 1, type: 'all', priceRange: [0, 10000] });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        // Prepare params for Laravel (mapping frontend filter to backend expectations)
        const params: any = { capacite_min: f.guests };
        if (f.type !== 'all') params.type_chambre_id = f.type; // This needs proper ID mapping if type in f is string

        // If dates are not set, we might need a different endpoint or handle it in backend
        // For now, let's just fetch all available rooms if dates are missing, or provide defaults
        const { data } = await api.get('/chambres', { params: { ...params, date_arrivee: f.checkIn || undefined, date_depart: f.checkOut || undefined } });

        // Map Laravel response to our Room interface
        const mappedRooms: Room[] = data.chambres.map((r: any) => {
          // Normalisation du type pour correspondre aux icônes/filtres du frontend
          const nomType = r.type_chambre?.nom || '';
          let type: 'single' | 'double' | 'suite' | 'deluxe' = 'double';

          if (nomType.toLowerCase().includes('simpl')) type = 'single';
          else if (nomType.toLowerCase().includes('doubl')) type = 'double';
          else if (nomType.toLowerCase().includes('suite') || nomType.toLowerCase().includes('lux')) type = 'suite';
          else if (nomType.toLowerCase().includes('deluxe') || nomType.toLowerCase().includes('roy')) type = 'deluxe';

          return {
            id: r.id.toString(),
            name: r.type_chambre?.nom ? `${r.type_chambre.nom} #${r.numero}` : `Chambre ${r.numero}`,
            type: type,
            price: r.type_chambre?.prix_base || 0,
            capacity: r.type_chambre?.capacite || 2,
            size: r.type_chambre?.superficie || 30, // Utilise la superficie de la DB ou 30 par défaut
            amenities: r.type_chambre?.commodites ? r.type_chambre.commodites.split(',') : ['WiFi', 'TV', 'Climatisation'],
            images: r.images?.length > 0
              ? r.images.map((img: any) => ({
                chemin_image: img.chemin_image,
                type_media: img.type_media || 'image'
              }))
              : [{ chemin_image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', type_media: 'image' }],
            description: r.type_chambre?.description || '',
            available: r.statut === 'disponible'
          };
        });

        setRooms(mappedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [f]);

  const handleBook = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const filtered = useMemo(() => rooms.filter(r => (f.type === 'all' || r.type === f.type) && r.capacity >= f.guests && r.price >= f.priceRange[0] && r.price <= f.priceRange[1]), [f, rooms]);

  return (
    <Layout>
      <section className="relative h-64 flex items-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/9663211-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>

        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="container relative mx-auto px-4 text-white z-20">
          <div className="flex gap-2 text-primary items-center mb-2"><Bed size={20} /> <span className="text-xs uppercase tracking-widest text-primary">Hébergement</span></div>
          <h1 className="text-4xl md:text-5xl font-bold font-display">Nos Chambres & Suites</h1>
          <p className="mt-2 max-w-xl opacity-80 font-medium">Sélection de luxe pour votre confort absolu.</p>
        </div>
      </section>

      <section className="py-12"><div className="container mx-auto px-4">
        <RoomFilters onFilter={setF} />

        <div className="my-8 flex items-center justify-between">
          <p className="text-sm opacity-50">{filtered.length} chambre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : filtered.length ? (
          <div className="grid md:grid-cols-3 gap-8">
            {filtered.map(r => (
              <RoomCard key={r.id} room={r} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center opacity-50"><Bed className="mx-auto h-16 w-16 mb-4" /><h3 className="text-xl font-bold">Aucune chambre</h3></div>
        )}
      </div></section>

      {selectedRoom && (
        <DoorModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          title={`Réservation : ${selectedRoom.name}`}
        >
          <BookingForm room={selectedRoom} onSuccess={() => setIsBookingOpen(false)} />
        </DoorModal>
      )}
    </Layout>
  );
};

export default Rooms;
