import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, User, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/axios';

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
      toast({ title: 'Succès', description: 'Statut mis à jour' }); fetchAll();
    } catch (e) { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-';

  const getStatusBadge = (statut: string) => {
    const config: Record<string, { label: string; color: string }> = {
      'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      'confirmee': { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
      'annulee': { label: 'Annulée', color: 'bg-red-100 text-red-800' },
      'terminee': { label: 'Terminée', color: 'bg-blue-100 text-blue-800' },
    };
    const s = config[statut] || { label: statut, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={s.color}>{s.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div><h1 className="text-3xl font-bold">Gestion des Réservations</h1><p className="text-muted-foreground">Suivi des séjours clients.</p></div>

        <Card className="p-4 flex flex-col sm:flex-row gap-4 shadow-md border-none">
          <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Référence ou Nom..." value={q} onChange={e => setQ(e.target.value)} className="pl-10 h-10" /></div>
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-48 h-10"><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="en_attente">En attente</SelectItem><SelectItem value="confirmee">Confirmées</SelectItem><SelectItem value="annulee">Annulées</SelectItem><SelectItem value="terminee">Terminées</SelectItem></SelectContent>
          </Select>
        </Card>

        <Card className="shadow-lg border-none">
          {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Chambre</TableHead><TableHead>Dates</TableHead><TableHead>Total</TableHead><TableHead>Statut</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>{filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell><div className="flex gap-2 items-center"><User size={14} className="opacity-50" /><div><div className="font-medium">{r.nom_client}</div><div className="text-xs opacity-50">{r.reference}</div></div></div></TableCell>
                  <TableCell>{r.chambre?.type_chambre?.nom} #{r.chambre?.numero}</TableCell>
                  <TableCell className="text-xs">{fmt(r.date_arrivee)} → {fmt(r.date_depart)}</TableCell>
                  <TableCell className="font-bold">{r.prix_total} MAD</TableCell>
                  <TableCell>{getStatusBadge(r.statut)}</TableCell>
                  <TableCell><div className="flex gap-2">
                    {r.statut === 'en_attente' && <><Button variant="outline" size="sm" onClick={() => updateStatus(r.id, 'confirmee')} className="text-emerald-600 border-emerald-100 hover:bg-emerald-50"><CheckCircle size={14} /></Button><Button variant="outline" size="sm" onClick={() => updateStatus(r.id, 'annulee')} className="text-red-600 border-red-100 hover:bg-red-50"><XCircle size={14} /></Button></>}
                    {r.statut === 'confirmee' && <Button size="sm" variant="secondary" onClick={() => updateStatus(r.id, 'terminee')}>Terminer</Button>}
                  </div></TableCell>
                </TableRow>
              ))}</TableBody></Table></div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;
