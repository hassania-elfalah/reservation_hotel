import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, CreditCard, AlertCircle, Loader2, Check } from 'lucide-react';

const FormField = ({ label, value, onChange, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="bg-white" />
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

    // Handle both raw API response and mapped frontend Room interface
    const roomPrice = room?.type_chambre?.prix_base || room?.price || 0;
    const roomName = room?.type_chambre?.nom || (room?.name?.split('#')[0].trim()) || "Chambre";
    const roomNumber = room?.numero || (room?.name?.split('#')[1]?.trim()) || "";

    const totalPrice = (nights > 0 ? nights : 0) * roomPrice;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nights <= 0) return toast({ title: 'Erreur', description: "Dates invalides", variant: 'destructive' });
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
            toast({ title: 'Réservation confirmée !' });
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/reservations');
            }
        } catch (e: any) {
            const errorMsg = e.response?.data ? Object.values(e.response.data).flat().join(', ') : "Erreur lors de la réservation";
            toast({ title: 'Erreur', description: errorMsg, variant: 'destructive' });
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-5 p-1">
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                <Card className="border-none shadow-none bg-accent/30"><CardHeader className="pb-2"><CardTitle className="flex gap-2 text-lg font-display"><Users size={18} className="text-primary" /> Informations Personnelles</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Nom complet" value={formData.nom} onChange={(v: string) => setFormData(p => ({ ...p, nom: v }))} required />
                        <FormField label="Email" type="email" value={formData.email} onChange={(v: string) => setFormData(p => ({ ...p, email: v }))} required />
                        <FormField label="Téléphone" value={formData.telephone} onChange={(v: string) => setFormData(p => ({ ...p, telephone: v }))} required />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-accent/30"><CardHeader className="pb-2"><CardTitle className="flex gap-2 text-lg font-display"><Calendar size={18} className="text-primary" /> Dates & Passagers</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <FormField label="Arrivée" type="date" value={formData.checkIn} onChange={(v: string) => setFormData(p => ({ ...p, checkIn: v }))} required />
                        <FormField label="Départ" type="date" value={formData.checkOut} onChange={(v: string) => setFormData(p => ({ ...p, checkOut: v }))} required />
                        <div className="space-y-2"><Label>Personnes</Label>
                            <Select value={formData.guests} onValueChange={v => setFormData(p => ({ ...p, guests: v }))}><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>{Array.from({ length: room?.type_chambre?.capacite || room?.capacity || 1 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={n.toString()}>{n} Pers.</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/10 shadow-none"><CardContent className="flex gap-4 p-4"><AlertCircle className="text-primary h-5 w-5 mt-0.5" /><div><h4 className="font-semibold text-sm">Paiement Garanti</h4><p className="text-xs opacity-70 italic">Aucun prépaiement requis. Réglez à votre arrivée.</p></div></CardContent></Card>

                <Button type="submit" size="lg" className="w-full bg-[#D4A017] hover:bg-[#B8860B] h-14 text-lg font-bold" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CreditCard className="mr-2 h-5 w-5" /> Réserver Maintenant</>}
                </Button>
            </form>

            <div className="lg:col-span-2">
                <Card className="h-fit shadow-md border-primary/10 sticky top-0"><CardHeader className="bg-primary/5 border-b pb-4"><CardTitle className="text-lg">Récapitulatif</CardTitle></CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="relative h-32 w-full overflow-hidden rounded-md bg-black">
                            {(() => {
                                const firstMedia = room?.images?.[0];
                                const isVideo = firstMedia?.type_media === 'video' || (typeof firstMedia === 'string' && (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm')));
                                const src = typeof firstMedia === 'object' ? firstMedia.chemin_image : (firstMedia || "/placeholder-room.jpg");

                                if (isVideo) {
                                    return (
                                        <video
                                            src={src}
                                            className="h-full w-full object-cover"
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
                                        className="h-full w-full object-cover"
                                        alt=""
                                    />
                                );
                            })()}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 px-3">
                                <span className="text-white font-bold text-sm"># {roomNumber}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider">{roomName}</p>
                            <h3 className="text-lg font-bold">Séjour de Luxe</h3>
                        </div>
                        <div className="space-y-2 text-sm border-t pt-2">
                            <div className="flex justify-between"><span>Prix par nuit</span><span>{roomPrice} MAD</span></div>
                            <div className="flex justify-between"><span>Nombre de nuits</span><span className="font-bold">{nights || 0}</span></div>
                            <div className="flex justify-between text-xl font-bold border-t border-dashed pt-2 mt-2">
                                <span>Total</span>
                                <span className="text-[#D4A017]">{totalPrice} MAD</span>
                            </div>
                        </div>
                        <div className="space-y-1 pt-2">
                            {['Confirmation immédiate', 'Annulation 48h', 'Wifi Gratuit'].map(t => (
                                <div key={t} className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase">
                                    <Check className="h-3 w-3 text-green-500" /> {t}
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
