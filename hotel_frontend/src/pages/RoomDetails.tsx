import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Maximize, Check, Star, Loader2, X, ChevronLeft, ChevronRight, Expand, Globe } from 'lucide-react';
import api from '@/lib/axios';
import { cn, formatCurrency } from '@/lib/utils';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import DoorModal from '@/components/Booking/DoorModal';
import BookingForm from '@/components/Booking/BookingForm';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MediaRenderer } from '@/components/common/MediaRenderer';
import { getErrorMessage } from '@/lib/api-error';
import { useToast } from '@/hooks/use-toast';
import { StarRating } from '@/components/common/StarRating';

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
  const { toast } = useToast();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    api.get(`/chambres/${id}`).then(res => {
      setRoom(res.data.data);
      setLoading(false);
    }).catch(e => {
      toast({ title: 'Erreur', description: getErrorMessage(e), variant: 'destructive' });
      setLoading(false);
    });

    api.get(`/chambres/${id}/reviews`).then(res => {
      setReviews(res.data);
      setReviewsLoading(false);
    }).catch(() => setReviewsLoading(false));
  }, [id, toast]);

  const images = room?.images || [];

  if (loading) return <Layout><div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#D4A017]" size={40} /></div></Layout>;
  if (!room) return <Layout><div className="py-20 text-center"><h1 className="text-3xl font-bold font-display">Chambre non trouvée</h1><Link to="/rooms"><Button className="mt-8 bg-[#D4A017]">Voir toutes nos chambres</Button></Link></div></Layout>;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.note, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <Layout>
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div key={mainImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <MediaRenderer src={images[mainImageIndex]?.chemin_image} type={images[mainImageIndex]?.type_media} className="w-full h-full object-cover opacity-90" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Badge className="bg-[#D4A017] hover:bg-[#B8860B] mb-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1">{room.type_chambre?.nom}</Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-2 uppercase tracking-tight">{room.type_chambre?.nom} <span className="text-[#D4A017] italic font-serif opacity-80">#{room.numero}</span></h1>
            {avgRating && (
              <div className="flex items-center gap-3 mt-4">
                <StarRating rating={Number(avgRating)} size={18} />
                <span className="text-sm font-bold tracking-widest">{avgRating} / 5</span>
                <span className="text-[10px] uppercase font-bold opacity-40">({reviews.length} avis)</span>
              </div>
            )}
          </motion.div>

          <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide max-w-full md:max-w-3xl">
            {images.map((media: any, i: number) => (
              <button key={i} onClick={() => setMainImageIndex(i)}
                className={cn(
                  "relative h-16 w-24 md:h-20 md:w-32 rounded-lg overflow-hidden transition-all duration-300 border-2 flex-shrink-0 group",
                  i === mainImageIndex ? "border-[#D4A017] scale-105" : "border-white/20 hover:border-white hover:scale-105"
                )}>
                <MediaRenderer src={media.chemin_image} type={media.type_media} className="w-full h-full object-cover" thumbnail={true} />
                {media.type_media === 'panorama' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                    <Globe className="text-white drop-shadow-lg" size={20} />
                  </div>
                )}
              </button>
            ))}
            <button onClick={() => { setLightboxIndex(mainImageIndex); setIsLightboxOpen(true); }} className="h-16 w-16 md:h-20 md:w-20 rounded-lg bg-black/50 border-2 border-white/20 flex flex-col items-center justify-center text-white hover:bg-[#D4A017] transition-all group flex-shrink-0">
              <Expand size={20} className="group-hover:scale-110 transition-transform" /><span className="text-[10px] mt-1 font-bold uppercase tracking-tighter hidden md:block">Galerie</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12 bg-card rounded-3xl p-10 shadow-2xl border border-border/10">
            <div className="flex flex-wrap gap-6 pb-10 border-b border-border/10">
              {[{ i: Users, v: `${room.type_chambre?.capacite} Personnes` }, { i: Maximize, v: `${room.type_chambre?.superficie || 30} m²` }, { i: Star, v: 'Service Premium' }].map((x, i) => (
                <div key={i} className="flex items-center gap-3 bg-accent/30 px-6 py-3 rounded-2xl border border-primary/5">
                  <x.i className="text-[#D4A017]" size={20} /><div><span className="text-sm font-bold uppercase tracking-wide">{x.v}</span></div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-display flex items-center gap-4 text-primary"><span className="w-1.5 h-8 bg-[#D4A017] rounded-full"></span> PRÉSENTATION</h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium italic opacity-80">{room.type_chambre?.description || "Une expérience de séjour inoubliable vous attend dans cette chambre élégamment aménagée."}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-display flex items-center gap-4 text-primary"><span className="w-1.5 h-8 bg-[#D4A017] rounded-full"></span> COMMODITÉS</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(room.type_chambre?.commodites?.split(',') || ['WiFi Haut débit', 'Petit-déjeuner inclus', 'Climatisation', 'Mini-bar', 'Service 24/7', 'Smart TV']).map((a: string) => (
                  <div key={a} className="flex items-center gap-4 p-5 rounded-2xl bg-accent/20 border border-transparent hover:border-[#D4A017]/20 transition-all hover:bg-accent/40 group">
                    <div className="h-10 w-10 rounded-xl bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017] group-hover:scale-110 transition-transform"><Check size={18} strokeWidth={3} /></div><span className="font-bold text-sm tracking-tight opacity-70 group-hover:opacity-100">{a.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-2xl bg-card overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] blur-[100px] opacity-10 rounded-full pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8 pb-8 border-b border-border/10">
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em] mb-1">Tarif par nuit</p>
                      <div className="flex items-baseline gap-2"><span className="text-4xl font-black text-[#D4A017] tracking-tighter">{formatCurrency(room.prix || room.type_chambre?.prix_base).replace(' MAD', '')}</span><span className="text-xs font-bold opacity-40 uppercase">MAD</span></div>
                    </div>
                    {room.statut === 'disponible' ? <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest">Disponible</Badge> : <Badge variant="destructive" className="uppercase tracking-widest text-[10px]">Indisponible</Badge>}
                  </div>
                  <div className="space-y-6">
                    {room.statut === 'disponible' ? (
                      <Button onClick={() => setIsBookingModalOpen(true)} className="w-full bg-[#D4A017] hover:bg-[#B8860B] text-white font-black h-16 text-lg rounded-2xl shadow-xl shadow-yellow-600/20 hover:scale-[1.02] transition-all uppercase tracking-widest">
                        Réserver Ce Séjour
                      </Button>
                    ) : <Button disabled className="w-full h-16 text-lg opacity-30 bg-gray-500 rounded-2xl uppercase tracking-widest">Épuisé</Button>}
                    <p className="text-[10px] text-center font-bold uppercase opacity-30 tracking-widest">Paiement sécurisé • Confirmation Immédiate</p>
                  </div>
                </CardContent>
              </Card>
              <div className="p-6 rounded-2xl bg-[#D4A017]/5 border border-[#D4A017]/10 flex items-center gap-5 group">
                <div className="h-12 w-12 rounded-xl bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017] flex-shrink-0 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                <div><p className="text-sm font-black uppercase tracking-tight">Besoin d'aide ?</p><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest tracking-tighter">Conciergerie 24h/24 & 7j/7</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 bg-card rounded-[2.5rem] p-10 shadow-2xl border border-border/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold font-display flex items-center gap-4 text-primary">
                <span className="w-1.5 h-8 bg-[#D4A017] rounded-full"></span>
                AVIS CLIENTS
              </h2>
              <p className="mt-2 text-muted-foreground font-medium italic opacity-60">Ce que nos voyageurs disent de leur séjour.</p>
            </div>

            {avgRating && (
              <div className="flex items-center gap-6 bg-accent/20 px-8 py-4 rounded-[2rem] border border-primary/5">
                <div className="text-center">
                  <p className="text-4xl font-black text-[#D4A017] tracking-tighter">{avgRating}</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Moyenne</p>
                </div>
                <div className="h-10 w-px bg-border/20" />
                <div className="space-y-1">
                  <StarRating rating={Number(avgRating)} size={14} />
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 text-center">{reviews.length} Expériences</p>
                </div>
              </div>
            )}
          </div>

          {reviewsLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#D4A017]" size={40} /></div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.map((rev, i) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] bg-accent/10 border border-border/5 hover:border-[#D4A017]/20 transition-all flex flex-col gap-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#B8860B] flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {rev.utilisateur?.nom?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold uppercase tracking-tight text-sm">{rev.utilisateur?.nom}</p>
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <StarRating rating={rev.note} size={12} />
                  </div>

                  <p className="text-sm font-medium leading-relaxed italic opacity-80">"{rev.commentaire}"</p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {rev.images.map((img: any, idx: number) => (
                        <div key={idx} className="h-20 w-32 rounded-xl overflow-hidden flex-shrink-0 cursor-zoom-in hover:scale-[1.05] transition-transform">
                          <img src={img.chemin_image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center opacity-30">
              <Star className="mx-auto h-12 w-12 mb-4" />
              <p className="font-black uppercase tracking-[0.2em] text-xs">Aucun avis pour le moment</p>
              <p className="text-[10px] font-bold mt-2">Soyez le premier à partager votre expérience après votre séjour.</p>
            </div>
          )}
        </section>

        <div className="mt-16 bg-card rounded-[2.5rem] p-10 shadow-2xl border border-border/5">
          <h2 className="text-3xl font-bold mb-8 font-display flex items-center gap-4 text-primary"><span className="w-1.5 h-8 bg-[#D4A017] rounded-full"></span> CALENDRIER</h2>
          <div className="p-1 w-full bg-accent/10 rounded-3xl overflow-hidden border border-border/5">
            <style>{CALENDAR_STYLES}</style>
            <FullCalendar
              plugins={[dayGridPlugin]} initialView="dayGridMonth" locale="fr"
              headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
              events={room.reservations?.map((r: any) => ({
                start: r.date_arrivee, end: new Date(new Date(r.date_depart).getTime() + 86400000).toISOString().split('T')[0],
                display: 'background', color: '#fbff03ff', allDay: true
              }))}
              height="auto" contentHeight="auto" aspectRatio={1.5}
            />
            <div className="mt-8 flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest border-t border-border/5 pt-6 pb-2">
              <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#ffd103ff] rounded-full shadow-[0_0_15px_#ffd103ff]"></div><span className="opacity-50">Déjà réservé</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 border-2 border-primary/20 rounded-full"></div><span className="opacity-50">Libre</span></div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-0 md:p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-white p-3 hover:bg-white/10 rounded-2xl z-[110] transition-colors"><X size={32} /></button>

            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); }}
              className="absolute left-2 md:left-8 text-white p-2 md:p-4 hover:bg-white/10 rounded-2xl z-10 transition-colors bg-black/20 md:bg-transparent"
            >
              <ChevronLeft size={32} className="md:w-12 md:h-12" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); }}
              className="absolute right-2 md:right-8 text-white p-2 md:p-4 hover:bg-white/10 rounded-2xl z-10 transition-colors bg-black/20 md:bg-transparent"
            >
              <ChevronRight size={32} className="md:w-12 md:h-12" />
            </button>

            <div className="relative w-full h-[70vh] md:max-w-7xl md:h-[85vh] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <MediaRenderer
                    src={images[lightboxIndex]?.chemin_image}
                    type={images[lightboxIndex]?.type_media}
                    className="max-w-full max-h-full object-contain rounded-xl"
                    showFullscreen={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 max-w-[90vw] md:max-w-4xl overflow-x-auto p-3 md:p-4 bg-white/5 backdrop-blur-lg rounded-2xl md:rounded-[2rem] border border-white/10 no-scrollbar" onClick={(e) => e.stopPropagation()}>
              {images.map((media: any, i: number) => (
                <div key={i} className={cn("relative h-12 w-20 md:h-16 md:w-24 flex-shrink-0 cursor-pointer transition-all duration-300 rounded-lg md:rounded-xl overflow-hidden border-2", i === lightboxIndex ? "border-[#D4A017] scale-110 shadow-lg shadow-yellow-600/20" : "border-transparent opacity-40 hover:opacity-100")} onClick={() => setLightboxIndex(i)}>
                  <MediaRenderer src={media.chemin_image} type={media.type_media} className="w-full h-full object-cover" thumbnail={true} />
                  {media.type_media === 'panorama' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="text-white drop-shadow-lg" size={16} />
                    </div>
                  )}
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
