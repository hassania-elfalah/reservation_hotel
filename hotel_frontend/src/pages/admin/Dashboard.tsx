import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bed, Calendar, TrendingUp, DollarSign, ArrowUpRight, Loader2, Sparkles, Activity, Clock, MessageSquare } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency, cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api-error';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revenueView, setRevenueView] = useState<'monthly' | 'weekly'>('monthly');

  useEffect(() => {
    api.get('/admin/statistiques').then(res => {
      setData(res.data); setLoading(false);
    }).catch(e => {
      toast({ title: 'Erreur', description: getErrorMessage(e), variant: 'destructive' });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-[#D4A017] opacity-40">
        <Loader2 className="animate-spin" size={48} />
        <p className="font-black uppercase tracking-[0.3em] text-xs">Analyse des données...</p>
      </div>
    </AdminLayout>
  );

  const stats = [
    { t: 'Chambres Libres', v: `${data?.chambres_disponibles || 0}/${data?.total_chambres || 0}`, i: Bed, c: 'Disponibilité', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { t: 'Occupation', v: `${Math.round((((data?.total_chambres || 0) - (data?.chambres_disponibles || 0)) / (data?.total_chambres || 1)) * 100) || 0}%`, i: TrendingUp, c: '+5.2%', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { t: 'Réservations', v: data?.total_reservations || 0, i: Calendar, c: `${data?.reservations_aujourdhui || 0} aujourd'hui`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { t: 'Chiffre d\'Affaires', v: formatCurrency(data?.revenu_total || 0), i: DollarSign, c: 'Revenue Total', color: 'text-[#D4A017]', bg: 'bg-[#D4A017]/10' },
    { t: 'Avis en Attente', v: data?.avis_en_attente || 0, i: MessageSquare, c: 'À modérer', color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#D4A017]"><Activity size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.3em]">Performances</span></div>
            <h1 className="text-4xl font-black font-display uppercase tracking-tight">Tableau de Bord</h1>
            <p className="text-muted-foreground font-medium opacity-60">Statistiques et indicateurs clés de votre établissement.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase font-black tracking-widest leading-none mb-1 opacity-40">Dernière mise à jour</p>
            <p className="text-xs font-bold text-primary">Aujourd'hui, {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((s, idx) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="border-none shadow-2xl bg-card rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">{s.t}</CardTitle>
                  <div className={`p-3 rounded-2xl ${s.bg} ${s.color} transition-colors group-hover:scale-110 duration-500`}><s.i size={20} /></div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tighter mb-2">{s.v}</div>
                  <div className={cn("inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", s.bg, s.color)}>
                    {s.c.includes('%') ? <ArrowUpRight size={12} /> : <Sparkles size={12} />}
                    <span>{s.c}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-2xl bg-card rounded-[2.5rem] p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-10 px-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#D4A017]" /> Évolution des Revenus
                </h3>
                <p className="text-[10px] opacity-40 uppercase font-bold tracking-tighter mt-1">{revenueView === 'monthly' ? '6 derniers mois' : '7 derniers jours'}</p>
              </div>
              <div className="bg-accent/50 p-1.5 rounded-xl flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRevenueView('monthly')}
                  className={cn(
                    "h-7 text-[9px] font-black uppercase px-3 transition-all duration-300 rounded-lg",
                    revenueView === 'monthly' ? "bg-white dark:bg-slate-800 shadow-sm" : "opacity-30"
                  )}
                >
                  Mensuel
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRevenueView('weekly')}
                  className={cn(
                    "h-7 text-[9px] font-black uppercase px-3 transition-all duration-300 rounded-lg",
                    revenueView === 'weekly' ? "bg-white dark:bg-slate-800 shadow-sm" : "opacity-30"
                  )}
                >
                  Hebdo
                </Button>
              </div>
            </div>

            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueView === 'monthly' ? (data?.revenue_monthly || []) : (data?.revenue_weekly || [])}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(212,160,23,0.05)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#D4A017', opacity: 0.5 }}
                    dy={10}
                  />
                  <YAxis
                    hide
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(2, 6, 23, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    labelStyle={{ color: '#D4A017', fontWeight: 900, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.2em' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4A017"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] p-8 flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2 text-primary">
              <Clock size={16} className="text-[#D4A017]" /> Flux d'activités
            </h3>
            <div className="space-y-8 flex-1">
              {data?.recent_activities?.length > 0 ? (
                data.recent_activities.map((act: any, idx: number) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 items-center group cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-accent group-hover:bg-[#D4A017] group-hover:text-white transition-all duration-500 flex items-center justify-center text-[10px] font-black uppercase shadow-inner">
                      {act.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black tracking-tighter uppercase">{act.client}</p>
                      <p className="text-[10px] font-bold text-[#D4A017] opacity-60 uppercase">Chambre #{act.chambre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">{act.date}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-2">
                  <Activity size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Aucune donnée</p>
                </div>
              )}
            </div>
            <Link to="/admin/reservations">
              <Button variant="ghost" className="mt-8 w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/10 bg-accent/30 hover:bg-[#D4A017] hover:text-white transition-all duration-500">Journal d'Audit Complet</Button>
            </Link>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

