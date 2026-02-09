import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Linkedin, Youtube, Share2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useSettings } from "@/context/SettingsContext";

interface SocialNetwork {
    id: string;
    name: string;
    url: string;
}

const ContactInfo = ({ icon: Icon, title, content, sub }: any) => (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-lg border border-gray-100 transition-transform hover:scale-105">
        <div className="p-3 rounded-xl bg-primary/10 text-primary"><Icon size={24} /></div>
        <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-muted-foreground">{content}</p>
            {sub && <p className="text-sm text-primary">{sub}</p>}
        </div>
    </div>
);

const Contact = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', sujet: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch user info from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.nom) {
            const names = user.nom.split(' ');
            setFormData(prev => ({
                ...prev,
                prenom: names[0] || '',
                nom: names.slice(1).join(' ') || '',
                email: user.email || ''
            }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/contact', formData);
            toast.success("Message envoyé ! Nous vous répondrons bientôt.");
            setFormData(prev => ({ ...prev, sujet: '', message: '' }));
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Erreur lors de l'envoi du message";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Parse social networks from settings
    let socialNetworks: SocialNetwork[] = [];
    try {
        if (settings.social_networks) {
            socialNetworks = JSON.parse(settings.social_networks);
        }
    } catch (e) {
        console.error('Error parsing social networks:', e);
    }

    // Get icon based on network name
    const getSocialIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('facebook')) return Facebook;
        if (lowerName.includes('instagram')) return Instagram;
        if (lowerName.includes('twitter') || lowerName.includes('x')) return Twitter;
        if (lowerName.includes('linkedin')) return Linkedin;
        if (lowerName.includes('youtube')) return Youtube;
        return Share2; // Default icon
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-5xl font-bold tracking-tight mb-4 font-display">Contactez-nous</h1>
                    <p className="text-lg text-muted-foreground">Une question ? Une demande particulière ? Notre équipe est à votre écoute.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-semibold mb-6">Nos Coordonnées</h2>
                        <div className="grid gap-6">
                            <ContactInfo icon={MapPin} title='Notre Adresse' content={settings.hotel_address} />
                            <ContactInfo icon={Phone} title='Téléphone' content={settings.hotel_phone} sub='Support 24h/24' />
                            <ContactInfo icon={Mail} title='Email Direct' content={settings.hotel_email} />
                        </div>
                        <div className="pt-8">
                            <h3 className="font-bold text-lg mb-4">Suivez notre actualité</h3>
                            {socialNetworks.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {socialNetworks.filter(s => s.url).map((social) => {
                                        const IconComponent = getSocialIcon(social.name);
                                        return (
                                            <a
                                                key={social.id}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={social.name}
                                                className="p-4 rounded-full bg-white/50 shadow-md hover:bg-[#D4A017] hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                                            >
                                                <IconComponent size={20} />
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun réseau social configuré</p>
                            )}
                        </div>
                    </div>

                    <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
                        <CardContent className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Prénom</Label>
                                        <Input
                                            value={formData.prenom}
                                            onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                                            className="bg-gray-50/50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nom</Label>
                                        <Input
                                            value={formData.nom}
                                            onChange={e => setFormData({ ...formData, nom: e.target.value })}
                                            className="bg-gray-50/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-gray-50/50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sujet</Label>
                                    <Input
                                        value={formData.sujet}
                                        onChange={e => setFormData({ ...formData, sujet: e.target.value })}
                                        placeholder="Ex: Réservation de groupe"
                                        className="bg-gray-50/50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        className="min-h-[150px] bg-gray-50/50"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-lg bg-[#D4A017] hover:bg-[#B8860B] shadow-lg transition-all duration-300"
                                >
                                    <Send className="mr-2 h-5 w-5" />
                                    {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
