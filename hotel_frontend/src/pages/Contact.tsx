import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";

const Contact = () => {
    const { settings } = useSettings();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState({ prenom: '', nom: '', email: '', sujet: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', data);
            toast.success('Votre message a été envoyé avec succès !');
            setSubmitted(true);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setData({ prenom: '', nom: '', email: '', sujet: '', message: '' });
        setSubmitted(false);
    };

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-black">
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920)' }} />
                <div className="container relative z-10 text-center text-white space-y-4">
                    <h1 className="text-5xl font-black font-display uppercase tracking-tight">Contactez-Nous</h1>
                    <p className="text-lg opacity-80 max-w-xl mx-auto font-medium">Une question ou une demande particulière ? Notre équipe est à votre écoute 24/7.</p>
                </div>
            </div>

            <section className="py-20 bg-accent/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold font-display uppercase tracking-tight mb-4">Informations</h2>
                                <p className="text-muted-foreground">Retrouvez-nous facilement ou contactez-nous directement via nos coordonnées officielles.</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: MapPin,
                                        t: "Adresse",
                                        v: settings.hotel_address || "123 Avenue Royale, Marrakech",
                                        link: settings.hotel_map_link || (settings.hotel_address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.hotel_address)}` : "https://www.google.com/maps/search/?api=1&query=123+Avenue+Royale+Marrakech")
                                    },
                                    { icon: Phone, t: "Téléphone", v: settings.hotel_phone || "+212 524 00 00 00", link: `tel:${(settings.hotel_phone || "+212 524 00 00 00").replace(/\s/g, '')}` },
                                    { icon: Mail, t: "Email", v: settings.hotel_email || "contact@hotel-palace.com", link: `mailto:${settings.hotel_email || "contact@hotel-palace.com"}` }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start p-6 bg-card rounded-[2rem] shadow-lg border border-border/50">
                                        <div className="h-12 w-12 rounded-2xl bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017] shrink-0">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase tracking-widest opacity-40 mb-1">{item.t}</h3>
                                            <a
                                                href={item.link}
                                                target={item.t === "Adresse" ? "_blank" : undefined}
                                                rel={item.t === "Adresse" ? "noopener noreferrer" : undefined}
                                                className="font-medium text-lg hover:text-[#D4A017] transition-colors"
                                            >
                                                {item.v}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-[#D4A017] text-white p-8">
                                <CardTitle className="flex items-center gap-3 text-2xl font-display uppercase tracking-tight">
                                    <Send size={24} /> Envoyez-nous un message
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {submitted ? (
                                    <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                        <div className="h-24 w-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                                            <Check size={48} strokeWidth={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Message Reçu !</h3>
                                            <p className="text-muted-foreground font-medium">
                                                Merci {data.prenom || 'pour votre message'}. <br />
                                                Notre équipe vous répondra dans les plus brefs délais.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleReset}
                                            variant="outline"
                                            className="rounded-xl font-bold uppercase tracking-widest text-[10px] border-2 border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white"
                                        >
                                            Envoyer un autre message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="prenom" className="uppercase text-[10px] font-black tracking-widest opacity-40">Prénom</Label>
                                                <Input id="prenom" required value={data.prenom} onChange={e => setData({ ...data, prenom: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="nom" className="uppercase text-[10px] font-black tracking-widest opacity-40">Nom</Label>
                                                <Input id="nom" required value={data.nom} onChange={e => setData({ ...data, nom: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="uppercase text-[10px] font-black tracking-widest opacity-40">Email</Label>
                                            <Input id="email" required type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sujet" className="uppercase text-[10px] font-black tracking-widest opacity-40">Sujet</Label>
                                            <Input id="sujet" required value={data.sujet} onChange={e => setData({ ...data, sujet: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="uppercase text-[10px] font-black tracking-widest opacity-40">Message</Label>
                                            <Textarea id="message" required value={data.message} onChange={e => setData({ ...data, message: e.target.value })} className="min-h-[150px] bg-accent/30 border-none rounded-xl resize-none p-4" />
                                        </div>
                                        <Button type="submit" disabled={loading} className="w-full bg-[#D4A017] hover:bg-[#B8860B] h-14 rounded-2xl font-black uppercase tracking-widest text-xs">
                                            {loading ? "Envoi en cours..." : "Envoyer le message"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;
