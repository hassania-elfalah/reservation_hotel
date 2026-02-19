import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, User, CheckCircle, XCircle, Loader2, CalendarRange, Hash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/axios';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getErrorMessage } from '@/lib/api-error';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearchFilter } from '@/components/admin/AdminSearchFilter';

const AdminReservations = () => {
  const { toast } = useToast();
  const [list, setList] = useState<any[]>([]), [q, setQ] = useState(''), [status, setStatus] = useState('all'), [loading, setLoading] = useState(true);

  const fetchAll = () => {
    api.get('/admin/reservations').then(res => { setList(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = list.filter(r => (status === 'all' || r.statut === status) && (r.nom_client?.toLowerCase().includes(q.toLowerCase()) || r.reference?.toLowerCase().includes(q.toLowerCase())));

  const updateStatus = async (id: number, s: string) => {
    try {
      await api.put(`/admin/reservations/${id}`, { statut: s });
      toast({ title: 'Succès', description: 'Statut de réservation mis à jour.' }); fetchAll();
    } catch (e: any) {
      toast({ title: 'Erreur', description: getErrorMessage(e), variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <AdminPageHeader
          title="Réservations"
          subtitle="Suivi et gestion des séjours en temps réel."
          actions={
            <div className="flex bg-accent/30 p-1 rounded-2xl border border-border/50">
              <Button variant={status === 'all' ? 'default' : 'ghost'} size="sm" onClick={() => setStatus('all')} className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest transition-all">Toutes</Button>
              <Button variant={status === 'en_attente' ? 'default' : 'ghost'} size="sm" onClick={() => setStatus('en_attente')} className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest transition-all">À Valider</Button>
            </div>
          }
        />

        <AdminSearchFilter
          searchQuery={q}
          onSearchChange={setQ}
          searchPlaceholder="Rechercher par référence, client..."
          filterValue={status}
          onFilterChange={setStatus}
          filterOptions={[
            { label: 'Tous les États', value: 'all' },
            { label: 'En attente', value: 'en_attente' },
            { label: 'Confirmées', value: 'confirmee' },
            { label: 'Annulées', value: 'annulee' },
            { label: 'Terminées', value: 'terminee' }
          ]}
        />

        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4 text-[#D4A017] opacity-40">
            <Loader2 className="animate-spin" size={48} />
            <p className="font-black uppercase tracking-[0.2em] text-xs">Extraction des réservations...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.length > 0 ? filtered.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border border-border/5 shadow-xl hover:shadow-2xl hover:border-[#D4A017]/30 transition-all duration-500 cursor-pointer bg-card/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden group">
                  <CardContent className="p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Client Information */}
                    <div className="flex items-center gap-5 w-full lg:w-1/4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-background flex items-center justify-center text-primary font-black text-xl shadow-inner border border-border/10 transition-transform group-hover:scale-110 duration-500">
                        {r.nom_client?.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg tracking-tight uppercase leading-none">{r.nom_client}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4A017] opacity-60">
                          <Hash size={10} strokeWidth={3} /> {r.reference}
                        </div>
                      </div>
                    </div>

                    {/* Room & Stay Duration */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-2/4 border-y lg:border-y-0 lg:border-x border-border/5 py-6 lg:py-0 px-8">
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Hébergement</p>
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm uppercase tracking-tight">{r.chambre?.type_chambre?.nom}</p>
                          <p className="text-[10px] font-black text-[#D4A017] uppercase">Chambre #{r.chambre?.numero}</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-center lg:text-left">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Période du Séjour</p>
                        <div className="flex items-center justify-center lg:justify-start gap-4 h-10 px-4 bg-accent/20 rounded-xl border border-border/5">
                          <span className="text-[10px] font-black uppercase">{formatDate(r.date_arrivee, { day: '2-digit', month: 'short' })}</span>
                          <CalendarRange size={14} className="text-[#D4A017] opacity-50" />
                          <span className="text-[10px] font-black uppercase">{formatDate(r.date_depart, { day: '2-digit', month: 'short' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Status Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-1/4">
                      <div className="space-y-1 text-left lg:text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Montant Total</p>
                        <p className="text-2xl font-black tracking-tighter text-emerald-500">{formatCurrency(r.prix_total)}</p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <StatusBadge status={r.statut} className="h-7 px-4 uppercase font-black text-[9px]" />
                        <div className="flex gap-2">
                          {(r.statut === 'confirmee' || r.statut === 'terminee') && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                api.get(`/admin/reservations/${r.id}/invoice`, { responseType: 'blob' })
                                  .then(res => {
                                    const url = window.URL.createObjectURL(new Blob([res.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', `facture_${r.reference}.pdf`);
                                    document.body.appendChild(link);
                                    link.click();
                                  });
                              }}
                              className="h-10 w-10 border-[#D4A017]/20 text-[#D4A017] hover:bg-[#D4A017] hover:text-white rounded-xl"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                            </Button>
                          )}
                          {r.statut === 'en_attente' && (
                            <>
                              <Button
                                onClick={() => updateStatus(r.id, 'confirmee')}
                                className="h-10 w-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                              >
                                <CheckCircle size={18} />
                              </Button>
                              <Button
                                onClick={() => updateStatus(r.id, 'annulee')}
                                className="h-10 w-10 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20"
                              >
                                <XCircle size={18} />
                              </Button>
                            </>
                          )}
                          {r.statut === 'confirmee' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(r.id, 'terminee')}
                              className="h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[9px] px-6 shadow-lg shadow-blue-500/20"
                            >
                              Finaliser
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="p-32 text-center opacity-20 flex flex-col items-center gap-6">
                <CalendarRange size={80} strokeWidth={1} />
                <p className="font-black uppercase tracking-[0.3em] text-sm">Aucune réservation trouvée</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;
