import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Search, Trash2, Eye, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';

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
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filterStatut, setFilterStatut] = useState<string>('all');

    const fetchContacts = async () => {
        try {
            const response = await api.get('/admin/contacts');
            const data = response.data.data || response.data || [];
            setContacts(data);
            setFilteredContacts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast({ title: 'Erreur', description: 'Impossible de charger les contacts', variant: 'destructive' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        let filtered = contacts;

        // Filtrer par recherche
        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.sujet.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrer par statut
        if (filterStatut !== 'all') {
            filtered = filtered.filter(c => c.statut === filterStatut);
        }

        setFilteredContacts(filtered);
    }, [searchQuery, filterStatut, contacts]);

    const viewContact = async (contact: Contact) => {
        setSelectedContact(contact);
        setDialogOpen(true);

        // Marquer comme lu si c'est un nouveau message
        if (contact.statut === 'nouveau') {
            try {
                await api.put(`/admin/contacts/${contact.id}/statut`, { statut: 'lu' });
                fetchContacts();
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const updateStatut = async (id: number, statut: string) => {
        try {
            await api.put(`/admin/contacts/${id}/statut`, { statut });
            toast({ title: 'Statut mis à jour' });
            fetchContacts();
            if (selectedContact?.id === id) {
                setSelectedContact({ ...selectedContact, statut: statut as any });
            }
        } catch (error: any) {
            toast({ title: 'Erreur', description: error.response?.data?.message || 'Impossible de mettre à jour le statut', variant: 'destructive' });
        }
    };

    const deleteContact = async (id: number) => {
        try {
            await api.delete(`/admin/contacts/${id}`);
            toast({ title: 'Message supprimé' });
            fetchContacts();
            setDialogOpen(false);
        } catch (error: any) {
            toast({ title: 'Erreur', description: error.response?.data?.message || 'Impossible de supprimer', variant: 'destructive' });
        }
    };

    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case 'nouveau':
                return <Badge className="bg-blue-100 text-blue-800 border-none"><Clock size={12} className="mr-1" /> Nouveau</Badge>;
            case 'lu':
                return <Badge className="bg-yellow-100 text-yellow-800 border-none"><Eye size={12} className="mr-1" /> Lu</Badge>;
            case 'traite':
                return <Badge className="bg-green-100 text-green-800 border-none"><CheckCircle size={12} className="mr-1" /> Traité</Badge>;
            default:
                return <Badge>{statut}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const stats = {
        total: contacts.length,
        nouveau: contacts.filter(c => c.statut === 'nouveau').length,
        lu: contacts.filter(c => c.statut === 'lu').length,
        traite: contacts.filter(c => c.statut === 'traite').length
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold font-display">Gestion des Messages</h1>
                        <p className="text-sm opacity-50">{stats.total} messages au total</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total</p>
                                    <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                                </div>
                                <Mail className="text-blue-600" size={40} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Nouveaux</p>
                                    <p className="text-3xl font-bold text-yellow-900">{stats.nouveau}</p>
                                </div>
                                <Clock className="text-yellow-600" size={40} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600">Lus</p>
                                    <p className="text-3xl font-bold text-orange-900">{stats.lu}</p>
                                </div>
                                <Eye className="text-orange-600" size={40} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Traités</p>
                                    <p className="text-3xl font-bold text-green-900">{stats.traite}</p>
                                </div>
                                <CheckCircle className="text-green-600" size={40} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 opacity-30" />
                        <Input
                            placeholder="Rechercher par nom, email ou sujet..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 border-none bg-card"
                        />
                    </div>

                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                        <SelectTrigger className="w-full md:w-48 border-none bg-card">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="nouveau">Nouveaux</SelectItem>
                            <SelectItem value="lu">Lus</SelectItem>
                            <SelectItem value="traite">Traités</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Messages List */}
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <Card className="border-none shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Mail className="mx-auto mb-4 text-muted-foreground" size={48} />
                            <h3 className="text-xl font-semibold mb-2">Aucun message</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || filterStatut !== 'all'
                                    ? 'Aucun message ne correspond à vos critères de recherche.'
                                    : 'Aucun message de contact pour le moment.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredContacts.map(contact => (
                            <Card
                                key={contact.id}
                                className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer bg-card/50 backdrop-blur-sm"
                                onClick={() => viewContact(contact)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg">
                                                    {contact.prenom} {contact.nom}
                                                </h3>
                                                {getStatutBadge(contact.statut)}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{contact.email}</p>
                                            <p className="font-semibold text-primary mb-2">{contact.sujet}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                                            <p className="text-xs text-muted-foreground mt-3">
                                                <Clock size={12} className="inline mr-1" />
                                                {formatDate(contact.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewContact(contact);
                                                }}
                                            >
                                                <Eye size={16} className="mr-2" /> Voir
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Detail Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-display text-2xl">Détails du message</DialogTitle>
                        </DialogHeader>

                        {selectedContact && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg">
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-50 mb-1">Prénom</p>
                                        <p className="font-semibold">{selectedContact.prenom}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-50 mb-1">Nom</p>
                                        <p className="font-semibold">{selectedContact.nom}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-50 mb-1">Email</p>
                                        <p className="font-semibold text-primary">{selectedContact.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-50 mb-1">Date</p>
                                        <p className="font-semibold">{formatDate(selectedContact.created_at)}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase opacity-50 mb-2">Sujet</p>
                                    <p className="font-bold text-lg text-primary">{selectedContact.sujet}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase opacity-50 mb-2">Message</p>
                                    <div className="p-4 bg-accent/20 rounded-lg">
                                        <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase opacity-50 mb-2">Statut du message</p>
                                    <div className="flex items-center gap-4">
                                        <Select
                                            value={selectedContact.statut}
                                            onValueChange={(value) => updateStatut(selectedContact.id, value)}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="nouveau">Nouveau</SelectItem>
                                                <SelectItem value="lu">Lu</SelectItem>
                                                <SelectItem value="traite">Traité</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {getStatutBadge(selectedContact.statut)}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.sujet}`)}
                                    >
                                        <Mail className="mr-2" size={16} />
                                        Répondre par email
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 size={16} className="mr-2" />
                                                Supprimer
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="border-none shadow-2xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-display text-xl">
                                                    Supprimer ce message ?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action est irréversible et supprimera définitivement le message de contact.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive"
                                                    onClick={() => deleteContact(selectedContact.id)}
                                                >
                                                    Confirmer la suppression
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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
