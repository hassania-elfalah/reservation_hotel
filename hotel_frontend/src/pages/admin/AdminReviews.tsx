import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    CheckCircle2,
    XCircle,
    Trash2,
    Loader2,
    MessageSquare,
    Calendar,
    Home,
    Clock,
    AlertCircle
} from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { StarRating } from '@/components/common/StarRating';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';

const AdminReviews = () => {
    const { toast } = useToast();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'tous' | 'en_attente' | 'approuve' | 'rejete'>('en_attente');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/reviews');
            setReviews(res.data);
        } catch (error) {
            toast({ title: 'Erreur', description: 'Impossible de charger les avis.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject' | 'delete') => {
        try {
            if (action === 'delete') {
                await api.delete(`/admin/reviews/${id}`);
                toast({ title: 'Avis supprimé' });
            } else {
                await api.put(`/admin/reviews/${id}/${action}`);
                toast({ title: action === 'approve' ? 'Avis approuvé' : 'Avis rejeté' });
            }
            fetchReviews();
        } catch (error) {
            toast({ title: 'Erreur', description: 'L\'action a échoué.', variant: 'destructive' });
        }
    };

    const filteredReviews = filter === 'tous'
        ? reviews
        : reviews.filter(r => r.statut === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approuve': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase tracking-widest text-[10px]">Approuvé</Badge>;
            case 'rejete': return <Badge variant="destructive" className="uppercase tracking-widest text-[10px]">Rejeté</Badge>;
            default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 uppercase tracking-widest text-[10px]">En Attente</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border/10">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <MessageSquare className="text-[#D4A017]" size={32} />
                            Modération des Avis
                        </h1>
                        <p className="text-muted-foreground font-medium mt-1">Gérez les retours et expériences de vos clients.</p>
                    </div>

                    <div className="flex bg-accent/20 p-1.5 rounded-2xl border border-primary/5">
                        {['tous', 'en_attente', 'approuve', 'rejete'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === f ? "bg-[#D4A017] text-white shadow-lg shadow-yellow-600/20" : "hover:bg-accent/40 opacity-40 hover:opacity-100"
                                )}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#D4A017]" size={40} /></div>
                ) : filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredReviews.map((rev) => (
                                <motion.div
                                    key={rev.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group h-full"
                                >
                                    <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden relative group-hover:shadow-2xl transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] blur-[100px] opacity-5 rounded-full pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                                        <CardContent className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#D4A017] to-[#B8860B] flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-background">
                                                        {rev.utilisateur?.nom?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-bold text-lg">{rev.utilisateur?.nom}</p>
                                                            {getStatusBadge(rev.statut)}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                                                            <Clock size={12} /> {new Date(rev.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <StarRating rating={rev.note} size={16} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-primary/5">
                                                    <Home size={16} className="text-[#D4A017]" />
                                                    <span className="text-xs font-bold truncate">Chambre {rev.chambre?.numero}</span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-primary/5">
                                                    <Calendar size={16} className="text-[#D4A017]" />
                                                    <span className="text-xs font-bold truncate">Réf: {rev.reservation?.reference}</span>
                                                </div>
                                            </div>

                                            <div className="bg-accent/20 p-6 rounded-2xl border border-primary/5 min-h-[100px] relative">
                                                <AlertCircle className="absolute top-4 right-4 text-[#D4A017]/10" size={40} />
                                                <p className="text-base italic font-medium opacity-80 leading-relaxed text-balance">"{rev.commentaire}"</p>
                                            </div>

                                            {rev.images && rev.images.length > 0 && (
                                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                    {rev.images.map((img: any, idx: number) => (
                                                        <div key={idx} className="h-24 w-36 rounded-xl overflow-hidden flex-shrink-0 cursor-zoom-in border border-border/10 hover:scale-[1.05] transition-transform">
                                                            <img src={img.chemin_image} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-4">
                                                {rev.statut !== 'approuve' && (
                                                    <Button
                                                        onClick={() => handleAction(rev.id, 'approve')}
                                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl border-none shadow-lg shadow-emerald-500/20"
                                                    >
                                                        <CheckCircle2 size={16} className="mr-2" /> Approuver
                                                    </Button>
                                                )}
                                                {rev.statut !== 'rejete' && (
                                                    <Button
                                                        onClick={() => handleAction(rev.id, 'reject')}
                                                        variant="outline"
                                                        className="flex-1 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all"
                                                    >
                                                        <XCircle size={16} className="mr-2" /> Rejeter
                                                    </Button>
                                                )}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-12 h-12 p-0 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all"
                                                        >
                                                            <Trash2 size={20} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Supprimer l'avis ?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-base font-medium">Cette action est irréversible et supprimera également les photos associées.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="gap-3">
                                                            <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Garder</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleAction(rev.id, 'delete')} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold uppercase tracking-widest text-[10px]">Supprimer Définitivement</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Card className="py-32 text-center border-dashed bg-card/20 rounded-[2.5rem]">
                        <MessageSquare className="mx-auto h-20 w-20 mb-6 opacity-5" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter opacity-20">Aucun avis {filter === 'tous' ? '' : filter.replace('_', ' ')}</h3>
                        <p className="mt-2 text-muted-foreground font-medium opacity-40">Dès qu'un client laissera un avis, il apparaîtra ici.</p>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminReviews;
