import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusLabel, getStatusColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, X, CalendarDays, Loader2, Download } from 'lucide-react';
import api from '@/lib/axios';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Reservations = () => {
  const { toast } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRes = () => {
    api.get('/mes-reservations').then(res => { setList(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchRes(); }, []);

  const annuler = async (id: number) => {
    try {
      await api.put(`/reservations/${id}/annuler`);
      toast({ title: 'Réservation annulée' }); fetchRes();
    } catch (e) { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const downloadBadge = async (id: number, ref: string) => {
    try {
      const response = await api.get(`/reservations/${id}/badge`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `badge_${ref}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      toast({ title: 'Erreur lors du téléchargement' });
    }
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  return (
    <Layout>
      <section className="relative h-48 flex items-center bg-black/60 bg-[url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1920')] bg-cover bg-center bg-blend-overlay">
        <div className="container mx-auto px-4 text-white">
          <div className="flex gap-2 text-primary items-center mb-2"><CalendarDays size={20} /> <span className="text-xs uppercase tracking-widest text-[#D4A017]">Historique</span></div>
          <h1 className="text-4xl font-bold">Mes Réservations</h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : list.length ? (
          <div className="space-y-6">
            {list.map(r => (
              <Card key={r.id} className="overflow-hidden flex flex-col lg:flex-row shadow-lg border-none bg-card/50 backdrop-blur-sm">
                <div className="w-full lg:w-64 h-48 lg:h-auto bg-muted overflow-hidden relative flex items-center justify-center">
                  {(() => {
                    const images = (r.chambre?.images && r.chambre.images.length > 0) ? r.chambre.images : [];
                    const firstMedia = images.find((m: any) => m.chemin_image) || images[0];
                    let src = firstMedia?.chemin_image || (typeof firstMedia === 'string' ? firstMedia : null);

                    const getPlaceholder = () => {
                      const typeInfo = r.chambre?.type_chambre || r.chambre?.typeChambre;
                      const name = typeInfo?.nom?.toLowerCase() || '';
                      if (name.includes('suite')) return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500";
                      if (name.includes('deluxe')) return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500";
                      return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500";
                    };

                    const fallback = getPlaceholder();

                    if (src) {
                      // Normalize URL: replace 127.0.0.1 with localhost for Windows compatibility
                      src = src.replace('127.0.0.1', 'localhost');

                      // Resolve relative paths
                      if (!src.startsWith('http') && !src.startsWith('data:')) {
                        const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
                        const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
                        src = `${cleanBase}${src.startsWith('/') ? '' : '/'}${src}`;
                      }
                    } else {
                      src = fallback;
                    }

                    // Detection logic for videos
                    const isVideo = firstMedia?.type_media === 'video' || (typeof src === 'string' && /\.(mp4|webm|mov|ogg)$/i.test(src));

                    if (isVideo && src !== fallback) {
                      return (
                        <video
                          key={src}
                          src={src}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      );
                    }

                    return (
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt=""
                        onError={(e: any) => {
                          if (e.target.src !== fallback) {
                            e.target.src = fallback;
                          }
                        }}
                      />
                    );
                  })()}
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Badge className={getStatusColor(
                        r.statut === 'en_attente' ? 'pending' :
                          r.statut === 'confirmee' ? 'confirmed' :
                            r.statut === 'terminee' ? 'completed' : 'cancelled'
                      )}>
                        {getStatusLabel(
                          r.statut === 'en_attente' ? 'pending' :
                            r.statut === 'confirmee' ? 'confirmed' :
                              r.statut === 'terminee' ? 'completed' : 'cancelled'
                        )}
                      </Badge>
                      <h3 className="text-xl font-bold mt-2">
                        {(r.chambre?.type_chambre?.nom || r.chambre?.typeChambre?.nom)} #{r.chambre?.numero}
                      </h3>
                      <p className="text-sm opacity-50">{r.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-50">Total</p>
                      <p className="text-2xl font-bold text-primary">{r.prix_total} MAD</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-4 gap-4 text-sm">
                    {[{ i: Calendar, l: 'Arrivée', v: fmt(r.date_arrivee) }, { i: Calendar, l: 'Départ', v: fmt(r.date_depart) }, { i: User, l: 'Invité', v: r.nom_client }, { i: Clock, l: 'Date', v: fmt(r.created_at) }].map((x, i) => (
                      <div key={i} className="flex gap-3"><x.i className="text-primary h-5 w-5" /><div><p className="text-xs opacity-50">{x.l}</p><p className="font-medium">{x.v}</p></div></div>
                    ))}
                  </div>
                  {['en_attente', 'confirmee'].includes(r.statut) && (
                    <div className="mt-6 flex gap-3">
                      {r.statut === 'confirmee' && (
                        <Button
                          onClick={() => downloadBadge(r.id, r.reference)}
                          variant="outline"
                          size="sm"
                          className="h-9 border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white"
                        >
                          <Download size={16} className="mr-2" /> Télécharger mon Badge
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="h-9"><X size={16} className="mr-2" /> Annuler</Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Annuler cette réservation ?</AlertDialogTitle><AlertDialogDescription>Cette action ne peut pas être annulée.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Garder</AlertDialogCancel><AlertDialogAction onClick={() => annuler(r.id)} className="bg-destructive">Confirmer l'annulation</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-20 text-center text-muted-foreground border-dashed bg-transparent"><CalendarDays className="mx-auto h-16 w-16 mb-4 opacity-20" /><h3 className="text-xl font-bold">Aucune réservation trouvée</h3><p className="mt-2">Commencez par choisir une chambre pour votre prochain séjour.</p></Card>
        )}
      </div>
    </Layout>
  );
};

export default Reservations;
