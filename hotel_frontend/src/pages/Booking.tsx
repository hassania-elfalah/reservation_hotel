import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import BookingForm from '@/components/Booking/BookingForm';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/chambres/${id}`).then(res => { setRoom(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div></Layout>;
  if (!room) return <Layout><div className="py-20 text-center"><h1 className="text-3xl font-bold">Chambre non trouvée</h1><Link to="/rooms"><Button className="mt-8">Voir toutes</Button></Link></div></Layout>;

  return (
    <Layout>
      <div className="border-b bg-card py-4"><div className="container mx-auto px-4"><Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button></div></div>
      <section className="py-12"><div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 font-display">Réserver votre séjour</h1>
        <p className="text-muted-foreground mb-10">Veuillez confirmer les détails de votre réservation pour la chambre #{room.numero}</p>

        <BookingForm room={room} />
      </div></section>
    </Layout>
  );
};

export default Booking;
