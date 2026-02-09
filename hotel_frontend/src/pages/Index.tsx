import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { rooms } from '@/lib/data';
import RoomCard from '@/components/rooms/RoomCard';
import { Star, Award, Shield, Clock, Sparkles, ChevronRight, Wifi, Car, UtensilsCrossed, Dumbbell, Loader2 } from 'lucide-react';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';
import { Room } from '@/lib/data';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useSettings } from '@/context/SettingsContext';

const Index = () => {
  const { settings } = useSettings();
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data: res } = await api.get('/chambres');
        const apiRooms = (res.chambres || []).slice(0, 3).map((r: any) => {
          const nomType = r.type_chambre?.nom || '';
          let type: 'single' | 'double' | 'suite' | 'deluxe' = 'double';
          if (nomType.toLowerCase().includes('simpl')) type = 'single';
          else if (nomType.toLowerCase().includes('doubl')) type = 'double';
          else if (nomType.toLowerCase().includes('suite') || nomType.toLowerCase().includes('lux')) type = 'suite';
          else if (nomType.toLowerCase().includes('deluxe')) type = 'deluxe';

          return {
            id: r.id.toString(),
            name: `${r.type_chambre?.nom || ''} #${r.numero}`,
            type: type,
            price: r.type_chambre?.prix_base || 0,
            capacity: r.type_chambre?.capacite || 2,
            size: r.type_chambre?.superficie || 30,
            amenities: r.type_chambre?.commodites ? r.type_chambre.commodites.split(',') : ['WiFi', 'TV'],
            images: r.images?.length > 0 ? r.images.map((img: any) => ({
              chemin_image: img.chemin_image,
              type_media: img.type_media || 'image'
            })) : [{ chemin_image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', type_media: 'image' }],
            available: r.statut === 'disponible',
            description: r.type_chambre?.description || ''
          };
        });

        // Use API rooms if available, otherwise fallback to static rooms
        setFeatured(apiRooms.length > 0 ? apiRooms : rooms.slice(0, 3));
      } catch (e) {
        setFeatured(rooms.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleBook = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const data = {
    features: [
      { icon: Star, t: 'Service 5 Étoiles', d: 'Un service personnalisé pour un séjour inoubliable.' },
      { icon: Award, t: 'Qualité Premium', d: 'Équipements haut de gamme et confort optimal.' },
      { icon: Shield, t: 'Sécurité Garantie', d: 'Surveillance 24h/24 pour votre tranquillité.' },
      { icon: Clock, t: 'Disponible 24/7', d: 'Notre équipe est à votre disposition à tout moment.' }
    ],
    amenities: [
      { icon: Wifi, l: 'WiFi Gratuit' },
      { icon: Car, l: 'Parking Privé' },
      { icon: UtensilsCrossed, l: 'Restaurant' },
      { icon: Dumbbell, l: 'Salle de Sport' }
    ]
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center bg-black">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920)' }} />
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-4 text-primary"><Sparkles size={20} /> <span className="uppercase tracking-widest text-sm">{settings.hotel_name}</span></div>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight">Vivez une <span className="text-primary block">Expérience Unique</span></h1>
            <p className="mt-6 text-lg opacity-80">Découvrez le summum du confort et de l'élégance.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/rooms"><Button size="lg" className="bg-[#D4A017] hover:bg-[#B8860B]">Réserver <ChevronRight className="ml-2" /></Button></Link>
              <Link to="/rooms"><Button size="lg" variant="outline" className="text-[#B8860B] border-white/16 hover:bg-white/50">Nos Chambres</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <div className="border-b bg-card py-6"><div className="container mx-auto px-4 flex flex-wrap justify-between gap-4">
        {data.amenities.map(a => <div key={a.l} className="flex items-center gap-3"><a.icon className="text-primary" size={20} /> <span className="text-sm font-medium">{a.l}</span></div>)}
      </div></div>

      {/* Why Choose Us */}
      <section className="py-20 text-center"><div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-display mb-12">Pourquoi Nous Choisir ?</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {data.features.map(f => (
            <div key={f.t} className="p-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6 text-primary"><f.icon size={32} /></div>
              <h3 className="text-xl font-bold mb-3">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* Featured Rooms */}
      <section className="bg-accent/50 py-20"><div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div><h2 className="text-4xl font-bold font-display">Nos Chambres</h2><p className="text-muted-foreground mt-2">Le raffinement à l'état pur.</p></div>
          <Link to="/rooms" className="hidden md:block"><Button variant="outline">Tout voir <ChevronRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">{featured.map(r => <RoomCard key={r.id} room={r} onBook={handleBook} />)}</div>
        )}
      </div></section>

      {/* CTA */}
      <section className="relative py-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920)' }} />
        <div className="absolute inset-0 bg-secondary/90" />
        <div className="container relative mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt pour un Séjour <span className="text-primary">Inoubliable</span> ?</h2>
          <Link to="/rooms"><Button size="lg" className="bg-[#D4A017] hover:bg-[#B8860B]">Réserver Maintenant <ChevronRight className="ml-2" /></Button></Link>
        </div>
      </section>

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

export default Index;
