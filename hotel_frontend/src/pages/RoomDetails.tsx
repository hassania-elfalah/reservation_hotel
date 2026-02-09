import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Maximize, Check, Calendar as CalendarIcon, Star, Loader2, X, ChevronLeft, ChevronRight, Expand, RotateCcw } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { fr } from 'date-fns/locale';
const CALENDAR_STYLES = `
  .fc { --fc-border-color: rgba(0, 0, 0, 0.05); --fc-button-bg-color: #D4A017; --fc-button-border-color: #D4A017; --fc-button-hover-bg-color: #B8860B; --fc-button-hover-border-color: #B8860B; --fc-today-bg-color: rgba(212, 160, 23, 0.1); font-family: inherit; font-size: 1rem; }
  .fc .fc-toolbar-title { font-size: 1.25em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .fc .fc-button { padding: 0.15rem 0.4rem; border-radius: 0.4rem; text-transform: uppercase; font-size: 1em; font-weight: bold; letter-spacing: 0.05em; }
  .fc .fc-daygrid-day-number { color: inherit; font-weight: 500; font-size: 0.9em; }
  .fc .fc-daygrid-day.fc-day-today { background-color: rgba(212, 158, 23, 0.32); }
  .fc-theme-standard .fc-scrollgrid { border: none; }
  .fc-theme-standard td, .fc-theme-standard th { border-color: rgba(0,0,0,0.05); }
  .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events { display: none; }
`;

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    api.get(`/chambres/${id}`).then(res => { setRoom(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const images = room?.images || [];
  const openFn = (fn: any) => (e: any) => { e.stopPropagation(); fn(); };

  if (loading) return <Layout><div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div></Layout>;
  if (!room) return <Layout><div className="py-20 text-center"><h1 className="text-3xl font-bold">Chambre non trouvée</h1><Link to="/rooms"><Button className="mt-8">Voir toutes</Button></Link></div></Layout>;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {images[mainImageIndex]?.type_media === 'video' ? (
            <motion.video key={`vid-${mainImageIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              src={images[mainImageIndex]?.chemin_image} className="absolute inset-0 w-full h-full object-cover opacity-90" autoPlay loop muted playsInline />
          ) : (
            <motion.img key={`img-${mainImageIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              src={images[mainImageIndex]?.chemin_image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920'} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Room" />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Badge className="bg-[#D4A017] hover:bg-[#B8860B] mb-4 text-sm px-3 py-1">{room.type_chambre?.nom}</Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-2">{room.type_chambre?.nom} <span className="text-[#D4A017] font-serif italic">#{room.numero}</span></h1>
          </motion.div>

          <div className="hidden md:flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide max-w-3xl">
            {images.map((media: any, i: number) => (
              <button key={i} onClick={() => setMainImageIndex(i)}
                className={cn("relative h-20 w-32 rounded-lg overflow-hidden transition-all duration-300 border-2 flex-shrink-0 group", i === mainImageIndex ? "border-[#D4A017] scale-105" : "border-white/20 hover:border-white hover:scale-105")}>
                {media.type_media === 'video' ? <video src={media.chemin_image} className="w-full h-full object-cover" muted /> : <img src={media.chemin_image} className="w-full h-full object-cover" alt="" />}
                {media.type_media === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-black border-b-[4px] border-b-transparent ml-0.5"></div></div></div>}
              </button>
            ))}
            <button onClick={() => { setLightboxIndex(mainImageIndex); setIsLightboxOpen(true); }} className="h-20 w-20 rounded-lg bg-black/50 border-2 border-white/20 flex flex-col items-center justify-center text-white hover:bg-[#D4A017] transition-all">
              <Expand size={24} /><span className="text-[10px] mt-1 font-bold">Voir tout</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Details */}
          <div className="lg:col-span-2 space-y-8 bg-card rounded-3xl p-8 shadow-xl border border-border/50">
            <div className="flex flex-wrap gap-4 pb-8 border-b">
              {[{ i: Users, v: `${room.type_chambre?.capacite} Personnes` }, { i: Maximize, v: `30 m²` }, { i: Star, v: '4.8/5 (Premium)' }].map((x, i) => (
                <div key={i} className="flex items-center gap-3 bg-accent/50 px-5 py-3 rounded-full border border-primary/10">
                  <x.i className="text-[#D4A017]" size={18} /><div><span className="text-sm font-bold">{x.v}</span></div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2 font-display flex items-center gap-3"><span className="w-1 h-8 bg-[#D4A017] rounded-full"></span> L'Expérience</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-justify font-light">{room.type_chambre?.description || "Description non disponible."}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 font-display flex items-center gap-3"><span className="w-1 h-8 bg-[#D4A017] rounded-full"></span> Vos Avantages Exclusifs</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {['WiFi Haut débit Illimité', 'Petit-déjeuner Royal inclus', 'Climatisation Intelligente', 'Mini-bar Premium', 'Service de chambre 24/7', 'Smart TV 4K'].map((a) => (
                  <div key={a} className="flex items-center gap-4 p-4 rounded-xl bg-accent/20 border border-transparent hover:border-[#D4A017]/30 transition-all hover:bg-accent/40">
                    <div className="h-10 w-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017]"><Check size={18} strokeWidth={3} /></div><span className="font-medium text-foreground/80">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-none shadow-2xl bg-card text-card-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-border/50">
                    <div>
                      <p className="text-sm opacity-60 font-medium uppercase tracking-wider mb-1">Tarif Exclusif</p>
                      <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-[#D4A017]">{room.type_chambre?.prix_base}</span><span className="text-xl font-medium">MAD</span><span className="text-sm opacity-60">/ nuit</span></div>
                    </div>
                    {room.statut === 'disponible' ? <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1">Disponible</Badge> : <Badge variant="destructive">Occupé</Badge>}
                  </div>
                  <div className="space-y-6">
                    {room.statut === 'disponible' ? (
                      <Button onClick={() => setIsBookingModalOpen(true)} className="w-full bg-[#D4A017] hover:bg-[#B8860B] text-black font-bold h-14 text-lg rounded-xl shadow-[0_4px_20px_rgba(212,160,23,0.3)] hover:scale-[1.02] transition-all">
                        <CalendarIcon size={20} className="mr-2" /> Réserver Maintenant
                      </Button>
                    ) : <Button disabled className="w-full h-14 text-lg opacity-50 bg-gray-800 text-white rounded-xl">Non Disponible</Button>}
                    <p className="text-xs text-center opacity-40">Paiement 100% sécurisé • Confirmation immédiate</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
                    <h4 className="font-bold text-sm uppercase tracking-widest opacity-80 mb-4">Inclus dans le prix</h4>
                    {[{ l: 'Taxes de séjour', v: 'Inclus' }, { l: 'Accès Piscine & Spa', v: 'Inclus' }, { l: 'Annulation', v: 'Gratuite -48h', c: 'text-[#D4A017]' }].map((x, i) => (
                      <div key={i} className={`flex justify-between text-sm ${x.c || 'opacity-70'}`}><span>{x.l}</span><span>{x.v}</span></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 p-4 rounded-xl bg-accent/30 border border-primary/10 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"><Users size={20} /></div>
                <div><p className="text-sm font-bold">Besoin d'aide ?</p><p className="text-xs text-muted-foreground">Appelez notre conciergerie 24/7</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="mt-12 bg-card rounded-3xl p-6 shadow-xl border border-border/50">
          <h2 className="text-2xl font-bold mb-6 font-display flex items-center gap-3"><span className="w-1 h-6 bg-[#D4A017] rounded-full"></span> Disponibilités</h2>
          <div className="p-6 border rounded-2xl bg-gradient-to-br from-card to-accent/20 shadow-inner w-full">
            <style>{CALENDAR_STYLES}</style>
            <FullCalendar
              plugins={[dayGridPlugin]} initialView="dayGridMonth" locale="fr"
              headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
              events={room.reservations?.map((r: any) => ({
                start: r.date_arrivee, end: new Date(new Date(r.date_depart).getTime() + 86400000).toISOString().split('T')[0],
                display: 'background', color: '#fbff03ff', allDay: true
              }))}
              height="auto" contentHeight="auto" aspectRatio={1}
            />
            <div className="mt-6 flex justify-center gap-6 text-[10px] border-t pt-2">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#ffd103ff] rounded-full shadow-[0_0_10px_#ffd103ff]"></div><span className="font-medium opacity-70">Déjà Réservé</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 border-2 border-muted-foreground/30 rounded-full"></div><span className="font-medium opacity-70">Disponible</span></div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10"><X size={32} /></button>
            <button onClick={openFn(() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length))} className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full z-10"><ChevronLeft size={40} /></button>
            <button onClick={openFn(() => setLightboxIndex((prev) => (prev + 1) % images.length))} className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full z-10"><ChevronRight size={40} /></button>
            <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              {images[lightboxIndex]?.type_media === 'video' ? <video src={images[lightboxIndex]?.chemin_image} className="w-full h-full object-contain max-h-[90vh]" controls autoPlay loop />
                : <img src={images[lightboxIndex]?.chemin_image} className="w-full h-full object-contain max-h-[90vh]" alt="" />}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4 py-2 bg-black/50 rounded-lg">
              {images.map((media: any, i: number) => (
                <div key={i} className={cn("h-12 w-16 opacity-50 hover:opacity-100 cursor-pointer transition-opacity border-2", i === lightboxIndex ? "border-primary opacity-100" : "border-transparent")} onClick={openFn(() => setLightboxIndex(i))}>
                  <img src={media.chemin_image || media} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DoorModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title={`Réservation : ${room.type_chambre?.nom} #${room.numero}`}>
        <BookingForm room={room} onSuccess={() => setIsBookingModalOpen(false)} />
      </DoorModal>
    </Layout>
  );
};

export default RoomDetails;
