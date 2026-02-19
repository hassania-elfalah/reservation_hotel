import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import RoomCard from '@/components/rooms/RoomCard';
import RoomFilters, { FilterState } from '@/components/rooms/RoomFilters';
import { Bed, Loader2, Sparkles, Heart, Briefcase, Users2, ShieldCheck, Sun } from 'lucide-react';
import api from '@/lib/axios';
import { Room } from '@/lib/data';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';
import { mapApiRoom } from '@/lib/room-mapper';
import { getErrorMessage } from '@/lib/api-error';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MOODS = [
  { id: 'calm', label: 'Relax & Calm', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'romantic', label: 'Romantic Stay', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'work', label: 'Work & Focus', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'family', label: 'Family Time', icon: Users2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'luxury', label: 'Luxury Stay', icon: ShieldCheck, color: 'text-[#D4A017]', bg: 'bg-[#D4A017]/10' },
];

const Rooms = () => {
  const { toast } = useToast();
  const [f, setF] = useState<any>({ checkIn: '', checkOut: '', guests: 1, type: 'all', priceRange: [0, 10000], atmosphere: null });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params: any = {
          capacite_min: f.guests,
          date_arrivee: f.checkIn || undefined,
          date_depart: f.checkOut || undefined
        };
        if (f.type !== 'all') params.type_chambre_id = f.type;
        if (f.atmosphere) params.atmosphere = f.atmosphere;

        const { data } = await api.get('/chambres', { params });
        setRooms(data.chambres.map(mapApiRoom));
      } catch (error) {
        toast({ title: 'Erreur', description: getErrorMessage(error), variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [f]);

  const filtered = useMemo(() => rooms.filter(r => (f.type === 'all' || r.type === f.type) && r.capacity >= f.guests && r.price >= f.priceRange[0] && r.price <= f.priceRange[1]), [f, rooms]);

  return (
    <Layout>
      <section className="relative h-64 flex items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/9663211-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="container relative mx-auto px-4 text-white z-20">
          <div className="flex gap-2 text-primary items-center mb-2"><Bed size={20} /> <span className="text-xs uppercase tracking-widest">Hébergement</span></div>
          <h1 className="text-4xl md:text-5xl font-bold font-display">Nos Chambres & Suites</h1>
          <p className="mt-2 max-w-xl opacity-80 font-medium tracking-tight italic">Sélection de luxe pour votre confort absolu.</p>
        </div>
      </section>

      <section className="pt-16 pb-8 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center gap-2 mb-3 text-[#D4A017]">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Smart Booking</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Quelle est votre ambiance aujourd'hui ?</h2>
            <p className="mt-2 text-muted-foreground font-medium opacity-60">Choisissez un mood et laissez-nous vous suggérer la chambre idéale.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {MOODS.map((mood) => {
              const active = f.atmosphere === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setF({ ...f, atmosphere: active ? null : mood.id })}
                  className={cn(
                    "group relative p-6 rounded-[2rem] border transition-all duration-500 text-center flex flex-col items-center gap-3 overflow-hidden",
                    active
                      ? "bg-white border-[#D4A017] shadow-2xl shadow-yellow-600/10 scale-105 z-10"
                      : "bg-white/40 border-border/50 hover:border-[#D4A017]/30 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                    mood.bg, mood.color,
                    active ? "scale-110 shadow-lg" : "scale-100"
                  )}>
                    <mood.icon size={24} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                    active ? "text-primary" : "text-muted-foreground opacity-60"
                  )}>
                    {mood.label}
                  </span>
                  {active && (
                    <motion.div layoutId="mood-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4A017]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-border/10">
        <div className="container mx-auto px-4">
          <RoomFilters onFilter={(newFilters) => setF({ ...f, ...newFilters })} />
          <div className="my-8 flex items-center justify-between">
            <p className="text-sm opacity-50">{filtered.length} chambre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</p>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : filtered.length ? (
            <div className="grid md:grid-cols-3 gap-8">{filtered.map(r => <RoomCard key={r.id} room={r} onBook={(rm) => { setSelectedRoom(rm); setIsBookingOpen(true); }} />)}</div>
          ) : (
            <div className="py-20 text-center opacity-50"><Bed className="mx-auto h-16 w-16 mb-4" /><h3 className="text-xl font-bold">Aucune chambre disponible</h3></div>
          )}
        </div></section>

      {selectedRoom && (
        <DoorModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={`Réservation : ${selectedRoom.name}`}>
          <BookingForm room={selectedRoom} onSuccess={() => setIsBookingOpen(false)} />
        </DoorModal>
      )}
    </Layout>
  );
};

export default Rooms;
