import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Calendar, Shield, LogOut, Loader2, Save, KeyRound } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import api from '@/lib/axios';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement du profil");
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put('/profile', user);
            toast.success("Profil mis à jour avec succès");
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
            toast.error('Veuillez remplir tous les champs du mot de passe');
            return;
        }

        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast.error('Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        setIsChangingPassword(true);
        try {
            await api.put('/password', passwordData);
            toast.success('Mot de passe mis à jour avec succès');
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            });
            setIsPasswordModalOpen(false);
        } catch (error: any) {
            console.error('Error changing password:', error);
            if (error.response?.data?.errors?.current_password) {
                toast.error(error.response.data.errors.current_password[0]);
            } else {
                toast.error("Erreur lors de la modification du mot de passe");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Info */}
                    <div className="md:w-1/3">
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                            <div className="h-32 bg-primary/20 relative">
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-full bg-background border-4 border-card flex items-center justify-center text-primary text-5xl font-bold shadow-lg">
                                        <span className="mb-2 uppercase translate-y-[-4px]">{user?.nom?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-16 text-center">
                                <h2 className="text-2xl font-bold font-display">{user?.nom || user?.name || 'Utilisateur'}</h2>
                                <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">{user?.role === 'admin' ? 'Administrateur' : 'Client Privilège'}</p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-left px-4 italic opacity-70">
                                        <Calendar size={16} />
                                        <span>Membre depuis Janvier 2026</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-left px-4 italic opacity-70">
                                        <Shield size={16} />
                                        <span>Compte Vérifié</span>
                                    </div>
                                </div>

                                <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/5"
                                        >
                                            <KeyRound className="mr-2 h-4 w-4" />
                                            Changer le mot de passe
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-display flex items-center gap-2">
                                                <Shield className="text-primary" /> Sécurité du Compte
                                            </DialogTitle>
                                            <DialogDescription>
                                                Modifiez votre mot de passe pour assurer la sécurité de votre compte.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleChangePassword}>
                                            <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                                                    <Input
                                                        id="current_password"
                                                        type="password"
                                                        value={passwordData.current_password}
                                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                        className="h-11 border-primary/10 focus:border-primary/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new_password">Nouveau mot de passe</Label>
                                                    <Input
                                                        id="new_password"
                                                        type="password"
                                                        value={passwordData.new_password}
                                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                        className="h-11 border-primary/10 focus:border-primary/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new_password_confirmation">Confirmer le nouveau mot de passe</Label>
                                                    <Input
                                                        id="new_password_confirmation"
                                                        type="password"
                                                        value={passwordData.new_password_confirmation}
                                                        onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                                        className="h-11 border-primary/10 focus:border-primary/30"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    className="bg-[#D4A017] hover:bg-[#B8860B] w-full h-11 shadow-lg shadow-yellow-600/20"
                                                    disabled={isChangingPassword}
                                                >
                                                    {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                                    {isChangingPassword ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="outline"
                                    className="w-full mt-4 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Se déconnecter
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Form */}
                    <div className="flex-1">
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-display text-2xl">Informations Personnelles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom complet</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="name"
                                                    value={user?.nom || user?.name || ''}
                                                    onChange={(e) => setUser({ ...user, nom: e.target.value })}
                                                    className="pl-10 h-11"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Adresse Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="pl-10 h-11 bg-muted/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    value={user?.telephone || ''}
                                                    onChange={(e) => setUser({ ...user, telephone: e.target.value })}
                                                    className="pl-10 h-11"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Ville / Pays</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="address"
                                                    placeholder="Casablanca, Maroc"
                                                    value={user?.adresse || ''}
                                                    onChange={(e) => setUser({ ...user, adresse: e.target.value })}
                                                    className="pl-10 h-11"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t flex justify-end">
                                        <Button
                                            type="submit"
                                            className="bg-[#D4A017] hover:bg-[#B8860B] px-8 h-11"
                                            disabled={saving}
                                        >
                                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Enregistrer les modifications
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;