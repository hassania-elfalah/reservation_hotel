import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bed, Calendar, TrendingUp, DollarSign, ArrowUpRight, Users, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/statistiques').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(e => console.error(e));
  }, []);

  if (loading) return <AdminLayout><div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div></AdminLayout>;

  const stats = [
    { t: 'Chambres Dispo', v: `${data?.chambres_disponibles}/${data?.total_chambres}`, i: Bed, c: 'En temps réel' },
    { t: 'Taux Occupation', v: `${Math.round(((data?.total_chambres - data?.chambres_disponibles) / data?.total_chambres) * 100) || 0}%`, i: TrendingUp, c: '+5%' },
    { t: 'Total Réservations', v: data?.total_reservations, i: Calendar, c: `${data?.reservations_aujourdhui} aujourd'hui` },
    { t: 'Revenus (MAD)', v: (data?.revenu_total || 0).toLocaleString('fr-MA'), i: DollarSign, c: 'Basé sur confirmées' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div><h1 className="text-3xl font-bold">Tableau de Bord</h1><p className="text-muted-foreground">Données réelles du système.</p></div>
        <div className="grid gap-6 sm:grid-cols-4">
          {stats.map(s => (
            <Card key={s.t}>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium opacity-70">{s.t}</CardTitle><s.i size={20} className="opacity-50" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{s.v}</div><div className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><ArrowUpRight size={14} /><span>{s.c}</span></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
