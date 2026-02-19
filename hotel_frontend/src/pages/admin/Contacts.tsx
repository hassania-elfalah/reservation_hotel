import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Search, Trash2, Eye, Clock, CheckCircle, Loader2, Users, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getErrorMessage } from '@/lib/api-error';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearchFilter } from '@/components/admin/AdminSearchFilter';

interface Contact {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    sujet: string;
    message: string;
    statut: 'nouveau' | 'lu' | 'traite';
    created_at: string;
}

const AdminContacts = () => {
    const { toast } = useToast();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filterStatut, setFilterStatut] = useState<string>('all');

    const fetchContacts = async () => {
        try {
            const response = await api.get('/admin/contacts');
            setContacts(response.data.data || response.data || []);
            setLoading(false);
        } catch (error) {
            toast({ title: 'Erreur', description: getErrorMessage(error), variant: 'destructive' });
            setLoading(false);
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    const filteredContacts = contacts.filter(c =>
        (filterStatut === 'all' || c.statut === filterStatut) &&
        (c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.sujet.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const viewContact = async (contact: Contact) => {
        setSelectedContact(contact);
        setDialogOpen(true);
        if (contact.statut === 'nouveau') {
            try {
                await api.put(`/admin/contacts/${contact.id}/statut`, { statut: 'lu' });
                fetchContacts();
            } catch (error) { console.error(error); }
        }
    };

    const updateStatut = async (id: number, statut: string) => {
        try {
            await api.put(`/admin/contacts/${id}/statut`, { statut });
            toast({ title: 'Succès', description: 'Statut mis à jour' });
            fetchContacts();
            if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, statut: statut as any });
        } catch (error) { toast({ title: 'Erreur', description: getErrorMessage(error), variant: 'destructive' }); }
    };

    const deleteContact = async (id: number) => {
        try {
            await api.delete(`/admin/contacts/${id}`);
            toast({ title: 'Supprimé' });
            fetchContacts();
            setDialogOpen(false);
        } catch (error) { toast({ title: 'Erreur', description: getErrorMessage(error), variant: 'destructive' }); }
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                <AdminPageHeader
                    title="Gestion des Messages"
                    subtitle={`${contacts.length} messages au total.`}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total', value: contacts.length, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/10', shadow: 'shadow-blue-500/10' },
                        { label: 'Nouveaux', value: contacts.filter(c => c.statut === 'nouveau').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', shadow: 'shadow-yellow-500/10' },
                        { label: 'Lus', value: contacts.filter(c => c.statut === 'lu').length, icon: Eye, color: 'text-orange-500', bg: 'bg-orange-500/10', shadow: 'shadow-orange-500/10' },
                        { label: 'Traités', value: contacts.filter(c => c.statut === 'traite').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', shadow: 'shadow-emerald-500/10' }
                    ].map(s => (
                        <Card key={s.label} className={cn("border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500", s.shadow)}>
                            <CardContent className="p-8 flex items-center justify-between relative overflow-hidden">
                                <div className="z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{s.label}</p>
                                    <p className="text-4xl font-black tracking-tighter">{s.value}</p>
                                </div>
                                <div className={`h-16 w-16 rounded-[1.5rem] ${s.bg} ${s.color} flex items-center justify-center relative z-10 transition-transform group-hover:rotate-12 duration-500`}>
                                    <s.icon size={32} />
                                </div>
                                <div className={`absolute -right-4 -bottom-4 h-32 w-32 ${s.bg} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <AdminSearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterValue={filterStatut}
                    onFilterChange={setFilterStatut}
                    filterOptions={[
                        { label: 'Tous les Messages', value: 'all' },
                        { label: 'Nouveaux', value: 'nouveau' },
                        { label: 'Lus', value: 'lu' },
                        { label: 'Traités', value: 'traite' }
                    ]}
                />

                {loading ? <div className="p-32 flex flex-col items-center justify-center gap-4 text-[#D4A017] opacity-40"><Loader2 className="animate-spin" size={48} /><p className="font-black uppercase tracking-[0.2em] text-xs">Mise à jour...</p></div> : (
                    <div className="grid gap-6">
                        {filteredContacts.map(c => (
                            <Card key={c.id} className="border border-border/5 shadow-xl hover:shadow-2xl hover:border-[#D4A017]/30 transition-all duration-500 cursor-pointer bg-card/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden group" onClick={() => viewContact(c)}>
                                <CardContent className="p-8 flex items-start justify-between gap-6">
                                    <div className="flex-1 space-y-5">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-background flex items-center justify-center text-primary font-black text-xl shadow-inner border border-border/10 uppercase transition-transform group-hover:scale-110 duration-500">
                                                {c.prenom.charAt(0)}{c.nom.charAt(0)}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-xl tracking-tight uppercase flex items-center gap-3">
                                                    {c.prenom} {c.nom}
                                                    <StatusBadge status={c.statut} className="text-[9px] h-5 px-3 uppercase font-black" />
                                                </h3>
                                                <div className="flex items-center gap-2 text-muted-foreground font-medium text-xs">
                                                    <Mail size={12} className="opacity-40" />
                                                    {c.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pl-2 border-l-2 border-accent/30 group-hover:border-[#D4A017]/50 transition-colors">
                                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#D4A017]">{c.sujet}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic font-medium">"{c.message}"</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Clock size={12} strokeWidth={3} />
                                            {formatDate(c.created_at, { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-[#D4A017]/20 text-[#D4A017] hover:bg-[#D4A017] hover:text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-[#D4A017]/20">
                                        <Eye size={18} className="mr-3" /> Lire
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        {filteredContacts.length === 0 && (
                            <div className="p-32 text-center opacity-20 flex flex-col items-center gap-6">
                                <Mail size={80} />
                                <p className="font-black uppercase tracking-[0.3em] text-sm">Boîte de réception vide</p>
                            </div>
                        )}
                    </div>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl border-none shadow-2xl overflow-y-auto max-h-[90vh] rounded-[2.5rem] p-0 dark:bg-slate-900 scrollbar-hide">
                        <DialogHeader className="p-8 bg-accent/30 border-b border-border/10"><DialogTitle className="font-display text-2xl uppercase tracking-tighter">Détails du message</DialogTitle></DialogHeader>
                        {selectedContact && (
                            <div className="p-10 space-y-10 bg-card">
                                {/* Header Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { l: 'Expéditeur', v: `${selectedContact.prenom} ${selectedContact.nom}`, icon: Users },
                                        { l: 'Email', v: selectedContact.email, icon: Mail },
                                        { l: 'Objet', v: selectedContact.sujet, icon: Send },
                                        { l: 'Reçu le', v: formatDate(selectedContact.created_at, { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: Clock }
                                    ].map((x, i) => (
                                        <div key={i} className="p-5 bg-accent/15 rounded-2xl border border-border/5 space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 tracking-widest">
                                                <x.icon size={12} /> {x.l}
                                            </div>
                                            <p className="font-bold tracking-tight text-sm truncate">{x.v}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Content */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest pl-2 flex items-center gap-2">
                                        <Mail size={12} /> Contenu du Message
                                    </p>
                                    <div className="p-10 bg-accent/5 border border-border/10 rounded-[2.5rem] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                            <Mail size={120} />
                                        </div>
                                        <p className="relative z-10 text-base leading-relaxed italic text-muted-foreground whitespace-pre-wrap font-medium">
                                            "{selectedContact.message}"
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-6 border-t border-border/10">
                                    <div className="w-full sm:w-auto space-y-3">
                                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest pl-1">Gestion du Statut</p>
                                        <Select value={selectedContact.statut} onValueChange={(v) => updateStatut(selectedContact.id, v)}>
                                            <SelectTrigger className="w-full sm:w-56 h-14 bg-accent/30 border-none rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-inner">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="border-none shadow-2xl rounded-2xl font-bold uppercase text-[10px] tracking-widest p-2">
                                                <SelectItem value="nouveau" className="rounded-xl focus:bg-blue-500/10 focus:text-blue-500">Nouveau</SelectItem>
                                                <SelectItem value="lu" className="rounded-xl focus:bg-orange-500/10 focus:text-orange-500">Lu</SelectItem>
                                                <SelectItem value="traite" className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-500">Traité</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-4 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="flex-1 sm:flex-none h-14 px-10 rounded-2xl border-[#D4A017]/30 text-[#D4A017] hover:bg-[#D4A017] hover:text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-[#D4A017]/20"
                                            onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.sujet}`)}
                                        >
                                            <Mail className="mr-3" size={18} /> Répondre par Mail
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="h-14 w-14 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-0 transition-colors">
                                                    <Trash2 size={24} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="border-none shadow-2xl rounded-[3rem] p-12 bg-white dark:bg-slate-900">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="font-display text-4xl uppercase tracking-tighter text-red-600">Suppression ?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-lg font-medium opacity-60 italic py-4">
                                                        Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="pt-8 gap-4">
                                                    <AlertDialogCancel className="h-14 rounded-2xl font-bold uppercase tracking-widest text-xs px-8 border-none bg-accent/20">Annuler</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700 h-14 rounded-2xl font-black uppercase tracking-widest text-xs px-10 shadow-xl shadow-red-600/30"
                                                        onClick={() => deleteContact(selectedContact.id)}
                                                    >
                                                        Supprimer Définitivement
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminContacts;
