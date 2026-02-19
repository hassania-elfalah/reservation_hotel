import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { rooms, Room } from '@/lib/data';
import RoomCard from '@/components/rooms/RoomCard';
import { Heart, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';

const Favorites = () => {
    const [favs, setFavs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const load = async () => {
        setLoading(true);
        const ids = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (ids.length === 0) {
            setFavs([]);
            setLoading(false);
            return;
        }

        try {
            // Pour l'instant on récupère tout et on filtre, ou on pourrait avoir un endpoint dédié
            const { data } = await api.get('/chambres');
            const allRooms: Room[] = data.chambres.map((r: any) => {
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
                    size: r.type_chambre?.superficie || 30,
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

            // On combine avec les chambres statiques pour ne rien perdre
            const combinedRooms = [...allRooms, ...rooms];

            // On filtre par ID (en s'assurant que ce sont des strings)
            const favoriteRooms = combinedRooms.filter(r => ids.map(String).includes(String(r.id)));

            // Supprimer les doublons potentiels par ID
            const uniqueFavs = Array.from(new Map(favoriteRooms.map(item => [item.id, item])).values());

            setFavs(uniqueFavs);
        } catch (error) {
            console.error("Failed to load favorite rooms:", error);
            // Fallback aux chambres statiques en cas d'erreur API
            setFavs(rooms.filter(r => ids.includes(r.id)));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        window.addEventListener('favoritesUpdated', load);
        return () => window.removeEventListener('favoritesUpdated', load);
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="mb-12 text-center flex flex-col items-center">
                    <div className="mb-4 h-16 w-16 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-500/50 hover:-rotate-6 transition-all duration-400 cursor-pointer">
                        <Heart className="h-8 w-8 fill-current" />
                    </div>
                    <h1 className="text-4xl font-bold">Mes Favoris</h1>
                    <p className="mt-4 text-muted-foreground">Retrouvez vos coups de cœur ici.</p>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
                ) : favs.length ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {favs.map(r => (
                            <RoomCard
                                key={r.id}
                                room={r}
                                onBook={(room) => {
                                    setSelectedRoom(room);
                                    setIsBookingOpen(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 bg-accent/20 rounded-3xl border-2 border-dashed border-accent text-center">
                        <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
                        <p className="text-muted-foreground mb-8">Commencez l'exploration pour ajouter des chambres.</p>
                        <Link to="/rooms"><Button className="bg-[#D4A017]"><Home className="mr-2 h-4 w-4" /> Explorer</Button></Link>
                    </div>
                )}
            </div>

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

export default Favorites;