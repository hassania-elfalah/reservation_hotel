import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { rooms } from '@/lib/data';
import RoomCard from '@/components/rooms/RoomCard';
import { Star, Award, Shield, Clock, Sparkles, ChevronRight, Wifi, Car, UtensilsCrossed, Dumbbell, Loader2 } from 'lucide-react';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';
import { Room } from '@/lib/data';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useSettings } from '@/context/SettingsContext';
import { mapApiRoom } from '@/lib/room-mapper';

const Index = () => {
    const { settings } = useSettings();
    const [featured, setFeatured] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data: res } = await api.get('/chambres');
                const apiRooms = (res.chambres || []).slice(0, 3).map(mapApiRoom);
                setFeatured(apiRooms.length > 0 ? apiRooms : rooms.slice(0, 3));
            } catch (e) {
                setFeatured(rooms.slice(0, 3));
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const handleBook = (room: Room) => { setSelectedRoom(room); setIsBookingOpen(true); };

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
            <section className="relative h-[85vh] flex items-center bg-black">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920)' }} />
                <div className="container relative mx-auto px-4">
                    <div className="max-w-2xl text-white">
                        <div className="flex items-center gap-2 mb-4 text-[#D4A017]"><Sparkles size={20} /> <span className="uppercase tracking-widest text-sm font-bold">{settings.hotel_name || 'Hôtel Plaza'}</span></div>
                        <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight">Vivez une <span className="text-[#D4A017] block">Expérience Unique</span></h1>
                        <p className="mt-6 text-lg opacity-80 leading-relaxed font-medium">Découvrez le summum du confort et de l'élégance dans un cadre prestigieux.</p>
                        <div className="mt-8 flex gap-4">
                            <Link to="/rooms"><Button size="lg" className="bg-[#D4A017] hover:bg-[#B8860B] shadow-xl">Réserver <ChevronRight className="ml-2" /></Button></Link>
                            <Link to="/rooms"><Button size="lg" variant="outline" className="text-[#B8860B] border-white/20 hover:bg-white/10 backdrop-blur-sm">Nos Chambres</Button></Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-b bg-card py-6"><div className="container mx-auto px-4 flex flex-wrap justify-between gap-4">
                {data.amenities.map(a => <div key={a.l} className="flex items-center gap-3"><a.icon className="text-[#D4A017]" size={20} /> <span className="text-sm font-bold tracking-tight">{a.l}</span></div>)}
            </div></div>

            <section className="py-20 text-center"><div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold font-display mb-12">Pourquoi Nous Choisir ?</h2>
                <div className="grid md:grid-cols-4 gap-8">
                    {data.features.map(f => (
                        <div key={f.t} className="p-6 group hover:translate-y-[-5px] transition-transform">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 text-[#D4A017] group-hover:bg-[#D4A017] group-hover:text-white transition-colors shadow-sm"><f.icon size={32} /></div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">{f.t}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                        </div>
                    ))}
                </div>
            </div></section>

            <section className="bg-accent/30 py-20"><div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div><h2 className="text-4xl font-bold font-display">Nos Chambres</h2><p className="text-muted-foreground mt-2 font-medium italic">Le raffinement à l'état pur.</p></div>
                    <Link to="/rooms" className="hidden md:block"><Button variant="outline" className="border-[#D4A017] text-[#D4A017]">Tout voir <ChevronRight className="ml-2 h-4 w-4" /></Button></Link>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#D4A017]" size={40} /></div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">{featured.map(r => <RoomCard key={r.id} room={r} onBook={handleBook} />)}</div>
                )}
            </div></section>

            <section className="relative py-32 text-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920)' }} />
                <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]" />
                <div className="container relative mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Prêt pour un Séjour <span className="text-[#D4A017]">Inoubliable</span> ?</h2>
                    <p className="mb-10 opacity-80 max-w-xl mx-auto font-medium">Réservez dès maintenant et profitez de nos offres exclusives.</p>
                    <Link to="/rooms"><Button size="lg" className="bg-[#D4A017] hover:bg-[#B8860B] h-14 px-10 text-lg shadow-2xl">Réserver Ma Chambre <ChevronRight className="ml-2" /></Button></Link>
                </div>
            </section>

            {selectedRoom && (
                <DoorModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={`Réservation : ${selectedRoom.name}`}>
                    <BookingForm room={selectedRoom} onSuccess={() => setIsBookingOpen(false)} />
                </DoorModal>
            )}
        </Layout>
    );
};

export default Index;
