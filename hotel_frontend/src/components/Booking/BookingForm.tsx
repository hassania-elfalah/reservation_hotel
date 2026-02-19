import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, CreditCard, AlertCircle, Loader2, Check } from 'lucide-react';
import { MediaRenderer } from '@/components/common/MediaRenderer';
import { formatCurrency } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api-error';

const FormField = ({ label, value, onChange, placeholder, type = "text", required = false, id }: any) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-[10px] uppercase font-bold opacity-40 ml-1">{label}</Label>
        <Input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="bg-white/50 border-none h-11 rounded-xl" />
    </div>
);

interface BookingFormProps {
    room: any;
    onSuccess?: () => void;
}

const BookingForm = ({ room, onSuccess }: BookingFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [formData, setFormData] = useState({ nom: user.nom || '', email: user.email || '', telephone: user.telephone || '', checkIn: '', checkOut: '', guests: '1' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nights = formData.checkIn && formData.checkOut ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / 86400000) : 0;

    const roomPrice = room?.prix || room?.type_chambre?.prix_base || room?.price || 0;
    const roomName = room?.type_chambre?.nom || (room?.name?.split('#')[0].trim()) || "Chambre";
    const roomNumber = room?.numero || (room?.name?.split('#')[1]?.trim()) || "";

    const totalPrice = (nights > 0 ? nights : 0) * roomPrice;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nights <= 0) return toast({ title: 'Erreur', description: "Veuillez sélectionner des dates valides", variant: 'destructive' });
        setIsSubmitting(true);
        try {
            await api.post('/reservations', {
                chambre_id: room.id,
                date_arrivee: formData.checkIn,
                date_depart: formData.checkOut,
                nom: formData.nom,
                email: formData.email,
                telephone: formData.telephone
            });
            toast({ title: 'Félicitations !', description: 'Votre réservation a été enregistrée.' });
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/reservations');
            }
        } catch (error: any) {
            toast({ title: 'Erreur', description: getErrorMessage(error), variant: 'destructive' });
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-5 p-1">
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                <Card className="border-none shadow-none bg-accent/20 rounded-2xl"><CardHeader className="pb-2"><CardTitle className="flex gap-2 text-sm font-bold uppercase tracking-widest"><Users size={16} className="text-[#D4A017]" /> Mon Profil</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <FormField id="nom" label="Nom complet" value={formData.nom} onChange={(v: string) => setFormData(p => ({ ...p, nom: v }))} required />
                        <FormField id="email" label="Email" type="email" value={formData.email} onChange={(v: string) => setFormData(p => ({ ...p, email: v }))} required />
                        <div className="sm:col-span-2"><FormField id="telephone" label="Téléphone" value={formData.telephone} onChange={(v: string) => setFormData(p => ({ ...p, telephone: v }))} required /></div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-accent/20 rounded-2xl"><CardHeader className="pb-2"><CardTitle className="flex gap-2 text-sm font-bold uppercase tracking-widest"><Calendar size={16} className="text-[#D4A017]" /> Séjour</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <FormField id="checkIn" label="Arrivée" type="date" value={formData.checkIn} onChange={(v: string) => setFormData(p => ({ ...p, checkIn: v }))} required />
                        <FormField id="checkOut" label="Départ" type="date" value={formData.checkOut} onChange={(v: string) => setFormData(p => ({ ...p, checkOut: v }))} required />
                        <div className="space-y-2"><Label htmlFor="guests" className="text-[10px] uppercase font-bold opacity-40 ml-1">Personnes</Label>
                            <Select value={formData.guests} onValueChange={v => setFormData(p => ({ ...p, guests: v }))}><SelectTrigger id="guests" className="bg-white/50 border-none h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="border-none shadow-xl rounded-xl">{Array.from({ length: room?.type_chambre?.capacite || room?.capacity || 1 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={n.toString()}>{n} Pers.</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-[#D4A017]/5 border border-[#D4A017]/10 rounded-2xl p-4 flex gap-4"><AlertCircle className="text-[#D4A017] h-5 w-5 mt-0.5" /><div><h4 className="font-bold text-sm uppercase tracking-tight">Paiement Garanti</h4><p className="text-xs opacity-60 font-medium">Aucun prépaiement requis sur ce site. Réglez le montant total lors de votre arrivée à l'hôtel.</p></div></div>

                <Button type="submit" size="lg" className="w-full bg-[#D4A017] hover:bg-[#B8860B] h-16 text-lg font-black uppercase tracking-widest shadow-xl shadow-yellow-600/20 rounded-2xl" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CreditCard className="mr-3 h-6 w-6" /> Confirmer Ma Réservation</>}
                </Button>
            </form>

            <div className="lg:col-span-2">
                <Card className="h-fit shadow-2xl border-none bg-card rounded-3xl sticky top-0 overflow-hidden group">
                    <CardHeader className="bg-accent/30 border-b border-border/10 pb-4"><CardTitle className="text-sm font-bold uppercase tracking-widest opacity-60">Récapitulatif</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="relative h-40 w-full overflow-hidden rounded-2xl shadow-inner">
                            <MediaRenderer src={room?.images?.[0]?.chemin_image || room?.images?.[0]} type={room?.images?.[0]?.type_media} />
                            <div className="absolute top-3 right-3"><Badge className="bg-[#D4A017] border-none shadow-lg">#{roomNumber}</Badge></div>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4"><p className="text-white font-black uppercase tracking-tight text-lg">{roomName}</p></div>
                        </div>

                        <div className="space-y-3 text-sm font-medium">
                            <div className="flex justify-between items-center opacity-60"><span>Prix / Nuit</span><span>{formatCurrency(roomPrice)}</span></div>
                            <div className="flex justify-between items-center opacity-60"><span>Séjour</span><span className="bg-accent px-2 py-0.5 rounded-full text-[10px] font-bold">{nights || 0} Nuit{nights > 1 ? 's' : ''}</span></div>
                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-border/30">
                                <span className="text-lg font-bold">TOTAL</span>
                                <span className="text-2xl font-black text-[#D4A017]">{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-2">
                            {['Confirmation 24h/24', 'Annulation Flexible', 'WiFi Haut Débit'].map(t => (
                                <div key={t} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Check size={10} strokeWidth={4} /></div> {t}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BookingForm;
