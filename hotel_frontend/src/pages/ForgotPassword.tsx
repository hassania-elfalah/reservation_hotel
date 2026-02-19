import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import api from '@/lib/axios';
import { getErrorMessage } from '@/lib/api-error';

const schema = z.object({
    email: z.string().email("Email invalide"),
});

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } });

    const onSubmit = async (v: any) => {
        setLoading(true);
        try {
            // Assuming there's a forgot-password endpoint
            await api.post('/forgot-password', v);
            toast.success('Lien de réinitialisation envoyé !');
            setIsSent(true);
        } catch (e: any) {
            toast.error(getErrorMessage(e) || 'Erreur lors de l\'envoi');
        } finally { setLoading(false); }
    };

    return (
        <AuthLayout
            title="Mot de passe oublié"
            subtitle="Entrez votre email pour recevoir un lien de réinitialisation."
            image="/vintage_hotel_key_roosevelt_style_1771330560189.png"
            sideTitle="Sécurité de votre compte."
            sideSubtitle="Nous vous aidons à retrouver l'accès à votre espace en quelques secondes."
        >
            {!isSent ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Professionnel</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="votre@email.com" {...field} className="pl-10 h-11" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button className="w-full h-11 bg-[#D4A017] hover:bg-[#B8860B]" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <>Réinitialiser Mon Mot de Passe <ArrowRight className="ml-2 h-4 w-4" /></>}
                        </Button>
                    </form>
                </Form>
            ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
                    <div className="h-12 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                    <h3 className="font-bold text-emerald-600 uppercase tracking-tight">Email Envoyé !</h3>
                    <p className="text-sm opacity-70">Consultez votre boîte de réception pour les instructions de récupération.</p>
                </div>
            )}

            <div className="pt-4">
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour à la connexion
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
